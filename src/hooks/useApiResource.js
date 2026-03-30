import { useCallback, useEffect, useState } from 'react'
import api from '../api/client'

export default function useApiResource(endpoint, query = {}) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const params = new URLSearchParams()
            Object.entries(query || {}).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    params.append(key, value)
                }
            })
            
            const url = params.toString() ? `${endpoint}?${params}` : endpoint
            console.log('Calling API:', url)
            const response = await api.get(url)
            console.log('API Response:', response.data)
            console.log('Data extracted:', response.data?.data ?? response.data)
            setData(response.data?.data ?? response.data)
        } catch (err) {
            console.error('API Error:', err)
            setError(err?.response?.data?.message || err.message || 'Khong tai duoc du lieu')
        } finally {
            setLoading(false)
        }
    }, [endpoint, query])

    useEffect(() => {
        load()
    }, [load])

    return { data, loading, error, reload: load }
}
