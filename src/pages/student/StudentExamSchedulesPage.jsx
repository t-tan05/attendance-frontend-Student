import { useState } from 'react'
import EndpointTable from '../../components/EndpointTable'

export default function StudentExamSchedulesPage() {
    const [searchQuery, setSearchQuery] = useState('')

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
                query={{ q: searchQuery || undefined }}
                columns={[
                    { header: 'Mon hoc', keys: ['subject_name', 'course_name', 'exam_name', 'title'] },
                    { header: 'Lop', keys: ['class_name', 'class_code'] },
                    { header: 'Ngay thi', keys: ['exam_date', 'date', 'start_at'], type: 'date' },
                    { header: 'Bat dau', keys: ['start_time', 'start_at'], type: 'datetime' },
                    { header: 'Ket thuc', keys: ['end_time', 'end_at'], type: 'datetime' },
                    { header: 'Phong', keys: ['room', 'room_name', 'location'] },
                    { header: 'Trang thai', keys: ['status'], type: 'status' },
                ]}
                emptyText="Ban chua co lich thi nao."
            />
        </div>
    )
}
