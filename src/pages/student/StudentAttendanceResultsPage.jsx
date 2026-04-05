import { useMemo, useState, useEffect } from 'react'
import EndpointTable from '../../components/EndpointTable'

export default function StudentAttendanceResultsPage() {
    const [currentPage, setCurrentPage] = useState(1)

    // Listen to URL changes
    useEffect(() => {
        const handleLocationChange = () => {
            const params = new URLSearchParams(window.location.search)
            const page = parseInt(params.get('page')) || 1
            setCurrentPage(page)
        }

        // Set initial page
        handleLocationChange()

        // Listen for popstate (back/forward buttons)
        window.addEventListener('popstate', handleLocationChange)
        
        return () => {
            window.removeEventListener('popstate', handleLocationChange)
        }
    }, [])

    // Memoize query object to include pagination
    const query = useMemo(() => {
        return { 
            limit: 10,
            page: currentPage
        }
    }, [currentPage])

    return (
        <div className="stacked-grid">
            <div className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Kết quả điểm danh</h2>
                        <p>Thông tin điểm danh trong các lịch thi của sinh viên.</p>
                    </div>
                </div>
            </div>

            <EndpointTable
                endpoint="/student/attendance-results"
                query={query}
                columns={[
                    { header: 'Môn học', keys: ['exam_schedule.subject_name', 'subject_name'] },
                    { header: 'Lớp', keys: ['student.class_code', 'class_code'] },
                    { header: 'Ngày thi', keys: ['exam_schedule.exam_date', 'exam_date'], type: 'date' },
                    { header: 'Giờ bắt đầu', keys: ['exam_schedule.exam_time', 'exam_schedule.start_time', 'start_time'], type: 'datetime' },
                    { header: 'Phòng', keys: ['exam_schedule.room', 'room'] },
                    { header: 'Điểm danh lúc', keys: ['attendance_time', 'attended_at', 'checked_at'], type: 'datetime' },
                    { header: 'Phương thức', keys: ['attendance_method', 'method'], type: 'status' },
                    { header: 'Kết quả', keys: ['rekognition_result', 'result'], type: 'status' },
                ]}
                emptyText="Chưa có bản ghi điểm danh nào."
            />
        </div>
    )
}
