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
            setError(err?.response?.data?.message || err.message || 'Khong tao duoc upload URL')
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
            setError(err?.response?.data?.message || err.message || 'Khong xac nhan duoc upload')
        } finally {
            setConfirmLoading(false)
        }
    }

    return (
        <div className="stacked-grid">
            <div className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Dang ky khuon mat</h2>
                        <p>Ho so dang ky anh khuon mat cho sinh vien.</p>
                    </div>
                </div>
                <p className="resource-endpoint">Quy trinh dang ky: Kiem tra window {'->'} Tao URL {'->'} Upload {'->'} Xac nhan</p>
            </div>

            <EndpointTable
                endpoint="/student/face-registration/window"
                columns={[
                    { header: 'Mo dang ky', keys: ['is_open', 'is_available', 'open'], type: 'status' },
                    { header: 'Bat dau', keys: ['start_at', 'start_time'], type: 'datetime' },
                    { header: 'Ket thuc', keys: ['end_at', 'end_time'], type: 'datetime' },
                    { header: 'Trang thai', keys: ['status', 'message'], type: 'status' },
                ]}
                emptyText="Khong co thong tin khung dang ky."
            />

            <section className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Buoc 1: Tao upload URL</h2>
                        <p>Sinh signed URL de upload anh khuon mat len storage.</p>
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
                        {uploadLoading ? 'Dang xu ly...' : 'Tao upload URL'}
                    </button>
                </form>

                {error && !uploadLoading && !confirmLoading ? <p className="error-note">{error}</p> : null}
                
                {uploadResult ? (
                    <article className="json-card">
                        <div className="row">
                            <strong>Trang thai</strong>
                            <span>{uploadResult?.status ?? uploadResult?.success ?? 'N/A'}</span>
                        </div>
                        {uploadResult?.message ? (
                            <div className="row">
                                <strong>Thong bao</strong>
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
                                <strong>Het han</strong>
                                <span>{uploadResult.expires_at}</span>
                            </div>
                        ) : null}
                    </article>
                ) : null}
            </section>

            <section className="resource-panel">
                <div className="resource-head">
                    <div>
                        <h2>Buoc 2: Xac nhan upload</h2>
                        <p>Sau khi upload anh xong, goi endpoint nay de xac nhan.</p>
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
                        {confirmLoading ? 'Dang xu ly...' : 'Xac nhan upload'}
                    </button>
                </form>

                {error && confirmLoading ? <p className="error-note">{error}</p> : null}
                
                {confirmResult ? (
                    <article className="json-card">
                        <div className="row">
                            <strong>Trang thai</strong>
                            <span>{confirmResult?.status ?? confirmResult?.success ?? 'N/A'}</span>
                        </div>
                        {confirmResult?.message ? (
                            <div className="row">
                                <strong>Thong bao</strong>
                                <span>{confirmResult.message}</span>
                            </div>
                        ) : null}
                    </article>
                ) : null}
            </section>
        </div>
    )
}
