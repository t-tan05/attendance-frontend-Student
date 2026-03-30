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
                        <h2>Lịch thi của bạn</h2>
                        <p>Danh sách lịch thi được cấp cho sinh viên hiện tại.</p>
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
                    { header: 'Mã môn', keys: ['subject_code'] },
                    { header: 'Môn học', keys: ['subject_name', 'subject.subject_name'] },
                    { header: 'Ngày thi', keys: ['exam_date', 'date'], type: 'date' },
                    { header: 'Giờ bắt đầu', keys: ['exam_time', 'start_time'], type: 'datetime' },
                    { header: 'Thời lượng (phút)', keys: ['duration'] },
                    { header: 'Phòng', keys: ['room', 'room_name'] },
                    { header: 'Ghi chú', keys: ['note'] },
                ]}
                emptyText="Bạn chưa có lịch thi nào."
            />
        </div>
    )
}
