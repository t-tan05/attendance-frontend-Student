import EndpointTable from '../../components/EndpointTable'

export default function StudentAttendanceResultsPage() {
    return (
        <div className="stacked-grid">
            <div className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Ket qua diem danh</h2>
                        <p>Thong tin diem danh trong cac lich thi cua sinh vien.</p>
                    </div>
                </div>
                <p className="resource-endpoint">GET /student/attendance-results</p>
            </div>

            <EndpointTable
                endpoint="/student/attendance-results"
                columns={[
                    { header: 'Mon hoc', keys: ['exam_schedule.subject_name', 'subject_name'] },
                    { header: 'Lop', keys: ['student.class_code', 'class_code'] },
                    { header: 'Ngay thi', keys: ['exam_schedule.exam_date', 'exam_date'], type: 'date' },
                    { header: 'Gio bat dau', keys: ['exam_schedule.exam_time', 'exam_schedule.start_time', 'start_time'], type: 'datetime' },
                    { header: 'Phong', keys: ['exam_schedule.room', 'room'] },
                    { header: 'Diem danh luc', keys: ['attendance_time', 'attended_at', 'checked_at'], type: 'datetime' },
                    { header: 'Phuong thuc', keys: ['attendance_method', 'method'], type: 'status' },
                    { header: 'Ket qua', keys: ['rekognition_result', 'result'], type: 'status' },
                    { header: 'Do tin cay', keys: ['confidence'] },
                ]}
                emptyText="Chua co ban ghi diem danh nao."
            />
        </div>
    )
}
