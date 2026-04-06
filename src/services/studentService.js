import api from '../api/client'

/**
 * Student Service
 * Handles all student-related API calls
 */
export const studentService = {
    /**
     * Get student's exam schedules
     * @param {Object} [params] - Query parameters
     * @param {number} [params.limit] - Items per page
     * @param {number} [params.page] - Page number
     * @param {string} [params.q] - Search query
     * @returns {Promise<Object>} Paginated exam schedules
     */
    getExamSchedules: async ({ limit, page, q } = {}) => {
        const params = {}
        if (limit !== undefined) params.limit = limit
        if (page !== undefined) params.page = page
        if (q !== undefined) params.q = q

        const response = await api.get('/student/exam-schedules', { params })
        return response.data
    },

    /**
     * Get student's attendance results
     * @param {Object} [params] - Query parameters
     * @param {number} [params.limit] - Items per page
     * @param {number} [params.page] - Page number
     * @returns {Promise<Object>} Paginated attendance results
     */
    getAttendanceResults: async ({ limit, page } = {}) => {
        const params = {}
        if (limit !== undefined) params.limit = limit
        if (page !== undefined) params.page = page

        const response = await api.get('/student/attendance-results', { params })
        return response.data
    },

    /**
     * Check face registration window status
     * @returns {Promise<Object>} Registration window info
     */
    getFaceRegistrationWindow: async () => {
        const response = await api.get('/student/face-registration/window')
        return response.data
    },

    /**
     * Generate upload URL for face registration
     * @param {Object} data - Upload data
     * @param {string} data.file_name - File name (must match student code)
     * @param {string} data.file_type - MIME type (image/jpeg or image/png)
     * @returns {Promise<Object>} Upload URL and S3 key
     */
    generateUploadUrl: async ({ file_name, file_type }) => {
        const response = await api.post('/student/face-registration/generate-upload-url', {
            file_name,
            file_type,
        })
        return response.data
    },

    /**
     * Confirm face registration upload
     * @param {Object} data - Confirm data
     * @param {string} data.file_name - Uploaded file name
     * @returns {Promise<Object>} Confirmation response
     */
    confirmUpload: async ({ file_name }) => {
        const response = await api.post('/student/face-registration/confirm-upload', {
            file_name,
        })
        return response.data
    },
}
