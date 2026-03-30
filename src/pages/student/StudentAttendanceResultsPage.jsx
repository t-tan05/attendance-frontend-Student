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
                    { header: 'Mon hoc', keys: ['subject_name', 'course_name', 'exam_name', 'title'] },
                    { header: 'Lop', keys: ['class_name', 'class_code'] },
                    { header: 'Ngay thi', keys: ['exam_date', 'date', 'start_at'], type: 'date' },
                    { header: 'Gio bat dau', keys: ['start_time', 'start_at'], type: 'datetime' },
                    { header: 'Trang thai', keys: ['attendance_status', 'status'], type: 'status' },
                    { header: 'Phuong thuc', keys: ['attendance_method', 'method'], type: 'status' },
                    { header: 'Thoi diem ghi nhan', keys: ['attended_at', 'checked_at', 'updated_at'], type: 'datetime' },
                    { header: 'Ghi chu', keys: ['note', 'remark'] },
                ]}
                emptyText="Chua co ban ghi diem danh nao."
            />
        </div>
    )
}
