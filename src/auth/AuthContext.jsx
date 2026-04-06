/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services'

const AuthContext = createContext(null)

function normalizeRole(user) {
    const rawRole = user?.role || user?.user_type || user?.type || null
    return typeof rawRole === 'string' ? rawRole.trim().toLowerCase() : null
}

function extractUser(payload) {
    if (!payload || typeof payload !== 'object') {
        return null
    }

    if (payload.user && typeof payload.user === 'object') {
        return payload.user
    }

    if (payload.data && typeof payload.data === 'object') {
        if (payload.data.user && typeof payload.data.user === 'object') {
            return payload.data.user
        }
        return payload.data
    }

    return payload
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('access_token'))
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const clearSession = useCallback(() => {
        localStorage.removeItem('access_token')
        setToken(null)
        setUser(null)
    }, [])

    const fetchMe = useCallback(async () => {
        if (!token) {
            setUser(null)
            return null
        }

        try {
            const data = await authService.getMe()
            const me = extractUser(data)
            const normalized = { ...me, role: normalizeRole(me) }
            setUser(normalized)
            return normalized
        } catch (error) {
            if (error?.response?.status === 401) {
                clearSession()
            }
            throw error
        }
    }, [clearSession, token])

    useEffect(() => {
        let mounted = true

        async function bootstrap() {
            setLoading(true)
            try {
                if (token) {
                    await fetchMe()
                } else {
                    setUser(null)
                }
            } catch {
                if (mounted) {
                    setUser(null)
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        bootstrap()
        return () => {
            mounted = false
        }
    }, [fetchMe, token])

    const login = useCallback(async ({ email, password, device_name }) => {
        const data = await authService.login({
            email,
            password,
            device_name: device_name || 'attendance-react-portal',
        })

        const nextToken = data?.access_token || data?.data?.access_token
        if (!nextToken) {
            throw new Error('Khong nhan duoc access_token tu server.')
        }

        localStorage.setItem('access_token', nextToken)
        setToken(nextToken)

        const loginUser = extractUser(data)

        if (!loginUser) {
            throw new Error('Khong nhan duoc thong tin user tu server.')
        }

        const normalized = { ...loginUser, role: normalizeRole(loginUser) }
        setUser(normalized)

        return normalized
    }, [])

    const logout = useCallback(async () => {
        try {
            await authService.logout()
        } catch {
            // Ignore backend logout failures and clear local session anyway.
        } finally {
            clearSession()
        }
    }, [clearSession])

    const value = useMemo(
        () => ({ token, user, loading, login, logout, fetchMe, clearSession }),
        [clearSession, fetchMe, loading, login, logout, token, user],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth phai duoc dung ben trong AuthProvider')
    }
    return context
}
