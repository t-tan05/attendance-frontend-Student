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
            const response = await api.get(url)
            
            // Handle different response structures
            let extractedData = response.data
            if (response.data?.data) {
                // Check if it's paginated (has nested data array)
                if (Array.isArray(response.data.data.data)) {
                    extractedData = response.data.data
                } else {
                    extractedData = response.data.data
                }
            }
            
            setData(extractedData)
        } catch (err) {
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
