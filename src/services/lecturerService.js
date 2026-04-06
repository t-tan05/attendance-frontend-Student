import api from '../api/client'

/**
 * Lecturer Service
 * Handles all lecturer-related API calls
 */
export const lecturerService = {
    /**
     * Get lecturer's exam schedules
     * @param {Object} [params] - Query parameters
     * @param {number} [params.limit] - Items per page
     * @param {number} [params.page] - Page number
     * @param {string} [params.q] - Search query
     * @param {string} [params.date] - Filter by date
     * @returns {Promise<Object>} Paginated exam schedules
     */
    getExamSchedules: async ({ limit, page, q, date } = {}) => {
        const params = {}
        if (limit !== undefined) params.limit = limit
        if (page !== undefined) params.page = page
        if (q !== undefined) params.q = q
        if (date !== undefined) params.date = date

        const response = await api.get('/lecturer/exam-schedules', { params })
        return response.data
    },

    /**
     * Get today's exam schedules
     * @returns {Promise<Object>} Today's exams
     */
    getTodayExams: async () => {
        const response = await api.get('/lecturer/exam-schedules/today')
        return response.data
    },

    /**
     * Get current exam schedule
     * @returns {Promise<Object>} Current exam info
     */
    getCurrentExam: async () => {
        const response = await api.get('/lecturer/exam-schedules/current')
        return response.data
    },

    /**
     * Check if student has exam today
     * @param {Object} params - Query parameters
     * @param {string} params.student_code - Student code to check
     * @returns {Promise<Object>} Student exam status
     */
    checkStudentTodayExam: async ({ student_code }) => {
        const response = await api.get('/lecturer/students/today-exam', {
            params: { student_code },
        })
        return response.data
    },

    /**
     * Submit face recognition attendance
     * @param {Object} data - Attendance data
     * @param {number} data.exam_schedule_id - Exam schedule ID
     * @param {string} data.image - Base64 encoded image
     * @param {boolean} data.commit - Whether to commit the attendance
     * @returns {Promise<Object>} Face recognition result
     */
    submitFaceRecognition: async ({ exam_schedule_id, image, commit }) => {
        const response = await api.post('/lecturer/attendance/face-recognition', {
            exam_schedule_id,
            image,
            commit,
        })
        return response.data
    },

    /**
     * Submit QR scan attendance
     * @param {Object} data - QR scan data
     * @param {number} data.exam_schedule_id - Exam schedule ID
     * @param {string} data.qr_content - QR code content
     * @param {boolean} data.commit - Whether to commit the attendance
     * @returns {Promise<Object>} QR scan result
     */
    submitQRScan: async ({ exam_schedule_id, qr_content, commit }) => {
        const response = await api.post('/lecturer/attendance/qr-scan', {
            exam_schedule_id,
            qr_content,
            commit,
        })
        return response.data
    },

    /**
     * Update attendance record
     * @param {Object} params - Update parameters
     * @param {number} params.id - Attendance record ID
     * @param {Object} data - Update data
     * @param {string} [data.attendance_time] - Attendance time
     * @param {string} [data.rekognition_result] - Recognition result
     * @param {number} [data.confidence] - Confidence score
     * @param {string} [data.attendance_method] - Method (manual, face, qr_code)
     * @returns {Promise<Object>} Updated attendance record
     */
    updateAttendanceRecord: async ({ id, ...data }) => {
        const response = await api.patch(`/lecturer/attendance-records/${id}`, data)
        return response.data
    },
}
