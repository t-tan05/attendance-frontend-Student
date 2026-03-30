import { useState } from 'react'
import api from '../../api/client'
import EndpointTable from '../../components/EndpointTable'

export default function StudentFaceRegistrationPage() {
    const [uploadPayload, setUploadPayload] = useState(`{
  "file_name": "student-face.jpg",
  "content_type": "image/jpeg"
}`)
    const [confirmPayload, setConfirmPayload] = useState(`{
  "file_key": "faces/student-face.jpg"
}`)
    const [uploadLoading, setUploadLoading] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [uploadResult, setUploadResult] = useState(null)
    const [confirmResult, setConfirmResult] = useState(null)
    const [error, setError] = useState('')

    const handleGenerateUploadUrl = async (e) => {
        e.preventDefault()
        setError('')
        setUploadResult(null)
        setUploadLoading(true)

        try {
            const parsed = JSON.parse(uploadPayload)
            const response = await api.post('/student/face-registration/generate-upload-url', parsed)
            setUploadResult(response.data)
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Không tạo được upload URL')
        } finally {
            setUploadLoading(false)
        }
    }

    const handleConfirmUpload = async (e) => {
        e.preventDefault()
        setError('')
        setConfirmResult(null)
        setConfirmLoading(true)

        try {
            const parsed = JSON.parse(confirmPayload)
            const response = await api.post('/student/face-registration/confirm-upload', parsed)
            setConfirmResult(response.data)
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Không xác nhận được upload')
        } finally {
            setConfirmLoading(false)
        }
    }

    return (
        <div className="stacked-grid">
            <div className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Đăng ký khuôn mặt</h2>
                        <p>Hồ sơ đăng ký ảnh khuôn mặt cho sinh viên.</p>
                    </div>
                </div>
                <p className="resource-endpoint">Quy trình đăng ký: Kiểm tra window {'->'} Tạo URL {'->'} Upload {'->'} Xác nhận</p>
            </div>

            <EndpointTable
                endpoint="/student/face-registration/window"
                columns={[
                    { header: 'Mở đăng ký', keys: ['is_open', 'is_available', 'open'], type: 'status' },
                    { header: 'Bắt đầu', keys: ['start_at', 'start_time'], type: 'datetime' },
                    { header: 'Kết thúc', keys: ['end_at', 'end_time'], type: 'datetime' },
                    { header: 'Trạng thái', keys: ['status', 'message'], type: 'status' },
                ]}
                emptyText="Không có thông tin khung đăng ký."
            />

            <section className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Bước 1: Tạo upload URL</h2>
                        <p>Sinh signed URL để upload ảnh khuôn mặt lên storage.</p>
                    </div>
                </div>
                <p className="resource-endpoint">POST /student/face-registration/generate-upload-url</p>

                <form className="post-form" onSubmit={handleGenerateUploadUrl}>
                    <textarea
                        rows={5}
                        value={uploadPayload}
                        onChange={(e) => setUploadPayload(e.target.value)}
                        spellCheck="false"
                    />
                    <button type="submit" disabled={uploadLoading}>
                        {uploadLoading ? 'Đang xử lý...' : 'Tạo upload URL'}
                    </button>
                </form>

                {error && !uploadLoading && !confirmLoading ? <p className="error-note">{error}</p> : null}
                
                {uploadResult ? (
                    <article className="json-card">
                        <div className="row">
                            <strong>Trạng thái</strong>
                            <span>{uploadResult?.status ?? uploadResult?.success ?? 'N/A'}</span>
                        </div>
                        {uploadResult?.message ? (
                            <div className="row">
                                <strong>Thông báo</strong>
                                <span>{uploadResult.message}</span>
                            </div>
                        ) : null}
                        {uploadResult?.upload_url ? (
                            <div className="row">
                                <strong>Upload URL</strong>
                                <pre>{uploadResult.upload_url}</pre>
                            </div>
                        ) : null}
                        {uploadResult?.s3_key ? (
                            <div className="row">
                                <strong>S3 Key</strong>
                                <pre>{uploadResult.s3_key}</pre>
                            </div>
                        ) : null}
                        {uploadResult?.expires_at ? (
                            <div className="row">
                                <strong>Hết hạn</strong>
                                <span>{uploadResult.expires_at}</span>
                            </div>
                        ) : null}
                    </article>
                ) : null}
            </section>

            <section className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Bước 2: Xác nhận upload</h2>
                        <p>Sau khi upload ảnh xong, gọi endpoint này để xác nhận.</p>
                    </div>
                </div>
                <p className="resource-endpoint">POST /student/face-registration/confirm-upload</p>

                <form className="post-form" onSubmit={handleConfirmUpload}>
                    <textarea
                        rows={5}
                        value={confirmPayload}
                        onChange={(e) => setConfirmPayload(e.target.value)}
                        spellCheck="false"
                    />
                    <button type="submit" disabled={confirmLoading}>
                        {confirmLoading ? 'Đang xử lý...' : 'Xác nhận upload'}
                    </button>
                </form>

                {error && confirmLoading ? <p className="error-note">{error}</p> : null}
                
                {confirmResult ? (
                    <article className="json-card">
                        <div className="row">
                            <strong>Trạng thái</strong>
                            <span>{confirmResult?.status ?? confirmResult?.success ?? 'N/A'}</span>
                        </div>
                        {confirmResult?.message ? (
                            <div className="row">
                                <strong>Thông báo</strong>
                                <span>{confirmResult.message}</span>
                            </div>
                        ) : null}
                    </article>
                ) : null}
            </section>
        </div>
    )
}
