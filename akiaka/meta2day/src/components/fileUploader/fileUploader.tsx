import React, { ChangeEvent, forwardRef, useImperativeHandle, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadProps {
    setFileUrl: (url: string) => void;
}

export interface FileUploadRef {
    uploadFileToS3: () => Promise<string | null>;
}

const FileUploader = forwardRef<FileUploadRef, FileUploadProps>(({ setFileUrl }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const uploadFileToS3 = async (): Promise<string | null> => {
        if (!selectedFile) return null;

        try {
            const formData = new FormData();

            const originalName = selectedFile.name;
            const fileExtension = originalName.substring(originalName.lastIndexOf('.'));
            const fileNameWithoutExtension = originalName.substring(0, originalName.lastIndexOf('.'));

            const uniqueFileName = `${fileNameWithoutExtension}_${uuidv4()}${fileExtension}`;
            const fileWithUniqueName = new File([selectedFile], uniqueFileName, { type: selectedFile.type });

            formData.append('file', fileWithUniqueName);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${errorText}`);
            }

            const { url } = await response.json();
            setFileUrl(url);
            return url;
        } catch (error) {
            console.error('Error during file upload:', error);
            return null;
        }
    };

    useImperativeHandle(ref, () => ({
        uploadFileToS3,
    }));

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
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

FileUploader.displayName = 'FileUploader';

export default FileUploader;