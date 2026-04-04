import React, { useState } from 'react';
import axios from 'axios'; // Import axios for direct S3 upload
import api from '../api/client'; // Assuming client.js is in src/api

const AvatarUpload = ({ studentCode }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setMessage('');
            setError('');
        } else {
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('Please select an image to upload.');
            return;
        }

        setUploading(true);
        setMessage('');
        setError('');

        try {
            // 1. Generate upload URL
            // Ensure filename matches student_code as per API documentation
            const fileName = `${studentCode}.${selectedFile.name.split('.').pop()}`;
            const fileType = selectedFile.type;

            const generateUploadUrlResponse = await api.post('/student/face-registration/generate-upload-url', {
                file_name: fileName,
                file_type: fileType,
            });

            const { upload_url } = generateUploadUrlResponse.data;

            // 2. Upload image directly to S3 (or the provided upload_url)
            await axios.put(upload_url, selectedFile, {
                headers: {
                    'Content-Type': fileType,
                },
            });

            // 3. Confirm upload with backend
            await api.post('/student/face-registration/confirm-upload', {
                file_name: fileName,
            });

            setMessage('Avatar uploaded successfully!');
            setSelectedFile(null);
            setPreviewUrl(null);

        } catch (err) {
            console.error('Upload error:', err);
            setError(`Upload failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
            <h3>Change Personal Avatar</h3>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
                {previewUrl && (
                    <div style={{ marginTop: '15px' }}>
                        <h4>Image Preview:</h4>
                        <img src={previewUrl} alt="Avatar Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid #eee' }} />
                    </div>
                )}
                <button type="submit" disabled={!selectedFile || uploading} style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {uploading ? 'Uploading...' : 'Upload Avatar'}
                </button>
            </form>
            {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
};

export default AvatarUpload;