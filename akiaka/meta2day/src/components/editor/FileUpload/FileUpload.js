import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { generatePresignedUrl } from '../../../app/api/s3/presign/route';

// eslint-disable-next-line react/display-name
const FileUpload = forwardRef(({ setFileUrl }, ref) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const uploadFileToS3 = async () => {
        if (!selectedFile) return null;

        const { uploadURL, key } = await generatePresignedUrl(selectedFile.name, selectedFile.type);

        if (!uploadURL || !key) return null;

        try {
            const response = await fetch(uploadURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': selectedFile.type,
                },
                body: selectedFile,
            });

            if (response.ok) {
                const cloudfrontUrl = `${key}`;
                setFileUrl(cloudfrontUrl);
                return cloudfrontUrl;
            } else {
                console.error('File upload failed:', response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                return null;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    };

    useImperativeHandle(ref, () => ({
        uploadFileToS3,
    }));

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            />
        </div>
    );
});

export default FileUpload;
