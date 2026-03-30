import { useMemo, useState } from 'react'
import EndpointTable from '../../components/EndpointTable'

export default function StudentExamSchedulesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    
    // Memoize query object to prevent unnecessary re-renders
    const query = useMemo(() => {
        return searchQuery ? { q: searchQuery } : {}
    }, [searchQuery])

    return (
        <div className="stacked-grid">
            <div className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Lich thi cua ban</h2>
                        <p>Danh sach lich thi duoc cap cho sinh vien hien tai.</p>
                    </div>
                </div>
                
                <div className="lookup-form" style={{ marginTop: '12px' }}>
                    <input
                        type="text"
                        placeholder="Tim kiem lich thi (ten mon, lop, ...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ marginBottom: '8px' }}
                    />
                </div>
            </div>

            <EndpointTable
                endpoint="/student/exam-schedules"
                query={query}
                columns={[
                    { header: 'Mon hoc', keys: ['subject_name', 'subject.subject_name'] },
                    { header: 'Ma mon', keys: ['subject_code'] },
                    { header: 'Ngay thi', keys: ['exam_date', 'date'], type: 'date' },
                    { header: 'Gio bat dau', keys: ['exam_time', 'start_time'], type: 'datetime' },
                    { header: 'Thoi luong (phut)', keys: ['duration'] },
                    { header: 'Phong', keys: ['room', 'room_name'] },
                    { header: 'Ghi chu', keys: ['note'] },
                ]}
                emptyText="Ban chua co lich thi nao."
            />
        </div>
    )
}
