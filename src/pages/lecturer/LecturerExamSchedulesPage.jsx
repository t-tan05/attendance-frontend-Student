import EndpointTable from '../../components/EndpointTable'

export default function LecturerExamSchedulesPage() {
    return (
        <div className="stacked-grid">
            <EndpointTable
                title="Lịch thi được phân công"
                description="Tổng hợp các lịch thi mà giảng viên đang phụ trách."
                endpoint="/lecturer/exam-schedules"
                columns={[
                    { header: 'Môn học', keys: ['subject_name', 'course_name', 'exam_name', 'title'] },
                    { header: 'Lớp', keys: ['class_name', 'class_code', 'group_name'] },
                    { header: 'Ngày thi', keys: ['exam_date', 'date', 'start_at'], type: 'date' },
                    { header: 'Ca thi', keys: ['session_name', 'session', 'time_slot'] },
                    { header: 'Phòng', keys: ['room', 'room_name', 'location'] },
                    { header: 'Trạng thái', keys: ['status'], type: 'status' },
                ]}
                emptyText="Bạn chưa được phân công lịch thi nào."
            />
        </div>
    )
}
