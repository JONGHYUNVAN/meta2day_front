import React, { useState, forwardRef, useImperativeHandle, ChangeEvent } from 'react';
import { generatePresignedUrl} from "@/app/api/s3/presign/route";
import sharp from 'sharp';
import {uploadToS3} from "@/components/fileUploader/uploadToS3";

interface FileUploadProps {
    setFileUrl: (url: string) => void;
}

export interface FileUploadRef {
    uploadFileToS3: () => Promise<string | null>;
}

const FileUploader = forwardRef<FileUploadRef, FileUploadProps>(({ setFileUrl }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const convertToWebP = async (file: File): Promise<Blob | null> => {
        try {
            const response = await fetch('/api/convert-webp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imagePath: file.name }),
            });

            if (response.ok) {
                const data = await response.json();
                return data.outputFilePath;
            } else {
                console.error('WebP conversion failed:', await response.text());
                return null;
            }
        } catch (error) {
            console.error('WebP conversion error:', error);
            return null;
        }
    };

    const uploadFileToS3 = async (): Promise<string | null> => {
        if (!selectedFile) return null;

        const webpFile = await convertToWebP(selectedFile);
        if (!webpFile) return null;

        const { uploadURL, key } = await generatePresignedUrl(`${selectedFile.name.split('.')[0]}.webp`, webpFile.type);

        if (!uploadURL || !key) return null;

        return await uploadToS3(uploadURL, webpFile, key);
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
