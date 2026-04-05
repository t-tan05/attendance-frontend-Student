import EndpointTable from '../../components/EndpointTable'
import StudentLookupPanel from '../../components/StudentLookupPanel'

export default function LecturerCurrentExamPage() {
    return (
        <div className="stacked-grid">
            <EndpointTable
                title="Ca thi hiện tại"
                description="Thông tin ca thi đang diễn ra ở thời điểm hiện tại."
                endpoint="/lecturer/exam-schedules/current"
                columns={[
                    { header: 'Môn học', keys: ['subject_name', 'course_name', 'exam_name', 'title'] },
                    { header: 'Bắt đầu', keys: ['start_time', 'start_at'], type: 'datetime' },
                    { header: 'Kết thúc', keys: ['end_time', 'end_at'], type: 'datetime' },
                    { header: 'Phòng', keys: ['room', 'room_name', 'location'] },
                    { header: 'Số SV', keys: ['student_count', 'students_count'] },
                    { header: 'Trạng thái', keys: ['status'], type: 'status' },
                ]}
                emptyText="Hiện tại không có ca thi đang diễn ra."
            />
            <StudentLookupPanel />
        </div>
    )
}
