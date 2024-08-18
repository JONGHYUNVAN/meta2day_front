export async function uploadToS3(uploadURL: string, webpFile: Blob, key: string): Promise<string | null> {
    try {
        const response = await fetch(uploadURL, {
            method: 'PUT',
            headers: {
                'Content-Type': webpFile.type,
            },
            body: webpFile,
        });

        if (response.ok) {
            const cloudfrontUrl = `${key}`;
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
}
