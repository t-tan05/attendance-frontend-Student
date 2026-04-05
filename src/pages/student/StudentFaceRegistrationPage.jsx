import { useState, useEffect } from 'react'
import axios from 'axios'
import api from '../../api/client'
import { useAuth } from '../../auth/AuthContext'

export default function StudentFaceRegistrationPage() {
    const { user } = useAuth()
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [windowInfo, setWindowInfo] = useState(null)
    const [loadingWindow, setLoadingWindow] = useState(true)

    // Fetch registration window info on mount
    useEffect(() => {
        fetchWindowInfo()
    }, [])

    const fetchWindowInfo = async () => {
        try {
            setLoadingWindow(true)
            const response = await api.get('/student/face-registration/window')
            setWindowInfo(response.data)
        } catch (err) {
            console.error('Failed to fetch window info:', err)
        } finally {
            setLoadingWindow(false)
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            // Validate file type
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setError('Chỉ chấp nhận file JPG hoặc PNG')
                return
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Kích thước file không được vượt quá 5MB')
                return
            }

            const studentCode = user?.student_code || user?.code
            if (!studentCode) {
                setError('Không tìm thấy mã sinh viên. Vui lòng đăng nhập lại.')
                return
            }

            const fileNameLower = file.name.toLowerCase()
            const studentCodeLower = studentCode.toLowerCase()

            if (!fileNameLower.startsWith('dh') && !fileNameLower.startsWith('dh')) {
                setError('Tên file phải bắt đầu bằng "DH" hoặc "dh".')
                return
            }
            if (!fileNameLower.includes(studentCodeLower)) {
                setError('Tên file phải chứa mã sinh viên của bạn.')
                return
            }

            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
            setMessage('')
            setError('')
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        if (!selectedFile) {
            setError('Vui lòng chọn ảnh để tải lên')
            return
        }

        const studentCode = user?.student_code || user?.code
        if (!studentCode) {
            setError('Không tìm thấy mã sinh viên. Không thể tải lên ảnh.')
            return
        }

        setUploading(true)
        setMessage('')
        setError('')

        try {
            // Step 1: Generate upload URL
            const fileName = `${studentCode}.${selectedFile.name.split('.').pop()}`
            const fileType = selectedFile.type

            const generateResponse = await api.post('/student/face-registration/generate-upload-url', {
                file_name: fileName,
                file_type: fileType,
            })

            const { upload_url } = generateResponse.data

            // Step 2: Upload image directly to S3
            await axios.put(upload_url, selectedFile, {
                headers: {
                    'Content-Type': fileType,
                },
            })

            // Step 3: Confirm upload with backend
            await api.post('/student/face-registration/confirm-upload', {
                file_name: fileName,
            })

            setMessage('Tải lên ảnh đại diện thành công!')
            setSelectedFile(null)
            setPreviewUrl(null)
            
            // Refresh window info
            fetchWindowInfo()

        } catch (err) {
            console.error('Upload error:', err)
            setError(`Tải lên thất bại: ${err.response?.data?.message || err.message}`)
        } finally {
            setUploading(false)
        }
    }

    const canRegister = windowInfo?.can_register || windowInfo?.is_open || windowInfo?.is_available

    return (
        <div className="stacked-grid">
            <div className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Đăng ký khuôn mặt</h2>
                        <p>Tải lên ảnh khuôn mặt của bạn để sử dụng cho điểm danh.</p>
                    </div>
                </div>
            </div>

            {/* Window Status */}
            {loadingWindow ? (
                <div className="resource-panel">
                    <p>Đang kiểm tra trạng thái đăng ký...</p>
                </div>
            ) : windowInfo ? (
                <div className="resource-panel">
                    <div className="resource-head">
                        <div>
                            <h3>Trạng thái đăng ký</h3>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                        <div>
                            <strong>Trạng thái:</strong>{' '}
                            <span style={{ 
                                color: canRegister ? '#10b981' : '#ef4444',
                                fontWeight: 'bold'
                            }}>
                                {canRegister ? 'Đang mở đăng ký' : 'Chưa mở đăng ký'}
                            </span>
                        </div>
                        {windowInfo.start_at && (
                            <div>
                                <strong>Bắt đầu:</strong> {new Date(windowInfo.start_at).toLocaleString('vi-VN')}
                            </div>
                        )}
                        {windowInfo.end_at && (
                            <div>
                                <strong>Kết thúc:</strong> {new Date(windowInfo.end_at).toLocaleString('vi-VN')}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            {/* Upload Form */}
            <section className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Tải lên ảnh đại diện</h2>
                        <p>Chọn ảnh khuôn mặt rõ ràng, ánh sáng tốt, nhìn thẳng vào camera</p>
                    </div>
                </div>

                {!canRegister && !loadingWindow && (
                    <div style={{ 
                        padding: '1rem', 
                        backgroundColor: '#fef3c7', 
                        borderLeft: '4px solid #f59e0b',
                        marginBottom: '1.5rem',
                        borderRadius: '4px'
                    }}>
                        <p style={{ margin: 0, color: '#92400e' }}>
                            ⚠️ Hiện tại chưa trong khung thời gian đăng ký. Vui lòng thử lại sau.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                    {/* File Input */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label 
                            htmlFor="avatar-upload" 
                            style={{
                                display: 'inline-block',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: canRegister ? '#3b82f6' : '#9ca3af',
                                color: 'white',
                                borderRadius: '0.5rem',
                                cursor: canRegister ? 'pointer' : 'not-allowed',
                                fontWeight: '500',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            📷 Chọn ảnh
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleFileChange}
                            disabled={!canRegister || uploading}
                            style={{ display: 'none' }}
                        />
                            VD: DH52200529.png
                        {selectedFile && (
                            <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                    </div>

                    {/* Image Preview */}
                    {previewUrl && (
                        <div style={{ 
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            backgroundColor: '#f9fafb',
                            borderRadius: '0.5rem',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#374151' }}>
                                Xem trước ảnh:
                            </h4>
                            <img 
                                src={previewUrl} 
                                alt="Xem trước ảnh đại diện" 
                                style={{ 
                                    maxWidth: '300px', 
                                    maxHeight: '300px', 
                                    width: '100%',
                                    objectFit: 'contain', 
                                    borderRadius: '0.5rem',
                                    border: '2px solid #e5e7eb'
                                }} 
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={!selectedFile || uploading || !canRegister}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: (!selectedFile || uploading || !canRegister) ? '#9ca3af' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: (!selectedFile || uploading || !canRegister) ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {uploading ? '⏳ Đang tải lên...' : '✅ Tải lên ảnh'}
                    </button>
                </form>

                {/* Messages */}
                {message && (
                    <div style={{ 
                        marginTop: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#d1fae5',
                        borderLeft: '4px solid #10b981',
                        borderRadius: '4px'
                    }}>
                        <p style={{ margin: 0, color: '#065f46' }}>{message}</p>
                    </div>
                )}

                {error && (
                    <div style={{ 
                        marginTop: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#fee2e2',
                        borderLeft: '4px solid #ef4444',
                        borderRadius: '4px'
                    }}>
                        <p style={{ margin: 0, color: '#991b1b' }}>{error}</p>
                    </div>
                )}
            </section>

            {/* Guidelines */}
            <section className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Hướng dẫn chụp ảnh</h2>
                    </div>
                </div>
                <ul style={{ lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                    <li>Ảnh rõ nét, không bị mờ</li>
                    <li>Ánh sáng đầy đủ, không quá tối hoặc quá sáng</li>
                    <li>Nhìn thẳng vào camera, không nghiêng đầu</li>
                    <li>Không đeo kính râm, khẩu trang hoặc vật che mặt</li>
                    <li>Phông nền đơn giản, tương phản với khuôn mặt</li>
                    <li>Định dạng: JPG hoặc PNG, tối đa 5MB</li>
                    <li>Tên file phải chứa mã sinh viên của bạn</li>
                </ul>
            </section>
        </div>
    )
}
