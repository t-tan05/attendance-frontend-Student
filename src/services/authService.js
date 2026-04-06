import api from '../api/client'

/**
 * Authentication Service
 * Handles all auth-related API calls
 */
export const authService = {
    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @param {string} [credentials.device_name] - Device name (optional)
     * @returns {Promise<Object>} Login response with access_token and user info
     */
    login: async ({ email, password, device_name }) => {
        const response = await api.post('/auth/login', {
            email,
            password,
            device_name: device_name || 'attendance-react-portal',
        })
        return response.data
    },

    /**
     * Get current user info
     * @returns {Promise<Object>} Current user data
     */
    getMe: async () => {
        const response = await api.get('/auth/me')
        return response.data
    },

    /**
     * Logout current user
     * @returns {Promise<Object>} Logout response
     */
    logout: async () => {
        const response = await api.post('/auth/logout')
        return response.data
    },

    /**
     * Logout from all devices
     * @returns {Promise<Object>} Logout all response
     */
    logoutAll: async () => {
        const response = await api.post('/auth/logout-all')
        return response.data
    },

    /**
     * Change password
     * @param {Object} passwords - Password data
     * @param {string} passwords.current_password - Current password
     * @param {string} passwords.new_password - New password
     * @param {string} passwords.new_password_confirmation - Confirm new password
     * @returns {Promise<Object>} Change password response
     */
    changePassword: async ({ current_password, new_password, new_password_confirmation }) => {
        const response = await api.post('/auth/change-password', {
            current_password,
            new_password,
            new_password_confirmation,
        })
        return response.data
    },

    /**
     * Delete a specific token
     * @param {string|number} tokenId - Token ID to delete
     * @returns {Promise<Object>} Delete token response
     */
    deleteToken: async (tokenId) => {
        const response = await api.delete(`/auth/tokens/${tokenId}`)
        return response.data
    },
}
