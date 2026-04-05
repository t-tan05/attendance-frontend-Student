import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../api/client'

export default function useApiResource(endpoint, query = {}) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [pagination, setPagination] = useState(null)

    // Stabilize query object reference using useMemo
    const queryString = useMemo(() => {
        const params = new URLSearchParams()
        Object.entries(query || {}).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, String(value))
            }
        })
        return params.toString()
    }, [JSON.stringify(query)])

    const load = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const url = queryString ? `${endpoint}?${queryString}` : endpoint
            const response = await api.get(url)
            
            // Handle different response structures
            let extractedData = response.data
            let paginationData = null
            
            if (response.data?.data) {
                // Check if it's paginated (Laravel standard pagination)
                if (Array.isArray(response.data.data.data)) {
                    extractedData = response.data.data.data
                    // Extract pagination metadata
                    paginationData = {
                        current_page: response.data.data.current_page,
                        last_page: response.data.data.last_page,
                        per_page: response.data.data.per_page,
                        total: response.data.data.total,
                        from: response.data.data.from,
                        to: response.data.data.to,
                    }
                } else {
                    extractedData = response.data.data
                }
            }
            
            setData(extractedData)
            setPagination(paginationData)
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Không tải được dữ liệu')
        } finally {
            setLoading(false)
        }
    }, [endpoint, queryString])

    useEffect(() => {
        load()
    }, [load])

    return { data, loading, error, reload: load, pagination }
}
