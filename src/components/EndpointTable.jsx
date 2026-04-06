import useApiResource from '../hooks/useApiResource'

function toRows(data) {
    // Direct array
    if (Array.isArray(data)) {
        return data
    }

    if (!data || typeof data !== 'object') {
        return []
    }

    // Handle pagination: data.data (Laravel standard)
    if (Array.isArray(data.data)) {
        return data.data
    }

    // Handle items
    if (Array.isArray(data.items)) {
        return data.items
    }

    // Handle list
    if (Array.isArray(data.list)) {
        return data.list
    }

    return [data]
}

function getValueByPath(obj, path) {
    if (!obj || !path) {
        return null
    }

    const parts = path.split('.')
    let current = obj

    for (const part of parts) {
        if (current == null) {
            return null
        }
        current = current[part]
    }

    return current
}

function pickFirst(item, keys) {
    for (const key of keys) {
        const value = getValueByPath(item, key)
        if (value !== null && value !== undefined && value !== '') {
            return value
        }
    }
    return null
}

function formatValue(value, type) {
    if (value === null || value === undefined || value === '') {
        return '-'
    }

    if (type === 'datetime') {
        const date = new Date(value)
        if (!Number.isNaN(date.getTime())) {
            return date.toLocaleString('vi-VN')
        }
    }

    if (type === 'date') {
        const date = new Date(value)
        if (!Number.isNaN(date.getTime())) {
            return date.toLocaleDateString('vi-VN')
        }
    }

    if (type === 'status') {
        if (String(value).toLowerCase() === 'match') {
            return 'có mặt';
        }
        // For other status values, still replace underscores with spaces
        return String(value).replaceAll('_', ' ')
    }

    if (typeof value === 'object') {
        return '-'
    }

    return String(value)
}

export default function EndpointTable({
    title,
    description,
    endpoint,
    query,
    columns,
    emptyText = 'Không có dữ liệu.',
}) {
    const { data, loading, error, reload, pagination } = useApiResource(endpoint, query)
    const rows = toRows(data)

    // Pagination handlers
    const goToPage = (page) => {
        if (!pagination || page < 1 || page > pagination.last_page) return
        
        // Update URL with new page
        const params = new URLSearchParams(window.location.search)
        params.set('page', page)
        const newUrl = `${window.location.pathname}?${params.toString()}`
        window.history.pushState({ page }, '', newUrl)
        
        // Dispatch popstate event to trigger parent component update
        window.dispatchEvent(new PopStateEvent('popstate', { state: { page } }))
    }

    return (
        <section className="resource-panel">
            {loading ? <p className="info-note">Đang tải dữ liệu...</p> : null}
            {error ? <p className="error-note">{error}</p> : null}

            {!loading && !error && rows.length === 0 ? <p className="info-note">{emptyText}</p> : null}

            {!loading && !error && rows.length > 0 ? (
                <>
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {columns.map((col) => (
                                        <th key={col.header}>{col.header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr key={row.id || row.uuid || idx}>
                                        {columns.map((col) => {
                                            const raw = pickFirst(row, col.keys)
                                            return <td key={col.header}>{formatValue(raw, col.type)}</td>
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mobile-cards">
                        {rows.map((row, idx) => (
                            <article className="mobile-card" key={row.id || row.uuid || idx}>
                                {columns.map((col) => {
                                    const raw = pickFirst(row, col.keys)
                                    return (
                                        <div className="mobile-field" key={col.header}>
                                            <strong>{col.header}</strong>
                                            <span>{formatValue(raw, col.type)}</span>
                                        </div>
                                    )
                                })}
                            </article>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination && pagination.last_page > 1 && (
                        <div style={{
                            marginTop: '1.5rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                        }}>
                            {/* Previous Button */}
                            <button
                                onClick={() => goToPage(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: pagination.current_page === 1 ? '#e5e7eb' : '#3b82f6',
                                    color: pagination.current_page === 1 ? '#9ca3af' : 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.875rem'
                                }}
                            >
                                ← Trước
                            </button>

                            {/* Page Info */}
                            <span style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                color: '#374151',
                                fontWeight: '500'
                            }}>
                                Trang {pagination.current_page} / {pagination.last_page}
                                {' '}(Tổng: {pagination.total} items)
                            </span>

                            {/* Next Button */}
                            <button
                                onClick={() => goToPage(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: pagination.current_page === pagination.last_page ? '#e5e7eb' : '#3b82f6',
                                    color: pagination.current_page === pagination.last_page ? '#9ca3af' : 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: pagination.current_page === pagination.last_page ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.875rem'
                                }}
                            >
                                Sau →
                            </button>
                        </div>
                    )}
                </>
            ) : null}
        </section>
    )
}
