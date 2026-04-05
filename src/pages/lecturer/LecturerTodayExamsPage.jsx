import EndpointTable from '../../components/EndpointTable'

export default function LecturerTodayExamsPage() {
    return (
        <div className="stacked-grid">
            <EndpointTable
                title="Lịch thi hôm nay"
                description="Danh sách ca thi hôm nay của giảng viên."
                endpoint="/lecturer/exam-schedules/today"
                columns={[
                    { header: 'Môn học', keys: ['subject_name', 'course_name', 'exam_name', 'title'] },
                    { header: 'Bắt đầu', keys: ['start_time', 'start_at'], type: 'datetime' },
                    { header: 'Kết thúc', keys: ['end_time', 'end_at'], type: 'datetime' },
                    { header: 'Phòng', keys: ['room', 'room_name', 'location'] },
                    { header: 'Số SV', keys: ['student_count', 'students_count'] },
                    { header: 'Trạng thái', keys: ['status'], type: 'status' },
                ]}
                emptyText="Hôm nay bạn không có ca thi nào."
            />
        </div>
    )
}
