import { generatePresignedUrl} from "../../../app/api/s3/presign/route";

export const uploadBase64Image = async (base64String, fileName) => {
    const byteString = atob(base64String.split(',')[1]);
    const mimeType = base64String.match(/data:([^;]+);/)[1];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeType });
    const { uploadURL, key } = await generatePresignedUrl(fileName, mimeType);

    const response = await fetch(uploadURL, {
        method: 'PUT',
        headers: {
            'Content-Type': mimeType,
        },
        body: blob,
    });

    if (response.ok) {
        return key;
    } else {
        throw new Error('Failed to upload image');
    }
};
