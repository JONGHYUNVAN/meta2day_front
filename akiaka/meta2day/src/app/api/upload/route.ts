import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
    try {
        // Parse the form data
        const data = await request.formData();
        const file = data.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert the file to WebP using sharp
        const buffer = await file.arrayBuffer();
        const webpBuffer = await sharp(Buffer.from(buffer))
            .webp()
            .toBuffer();

        const webpFile = new Blob([webpBuffer], { type: 'image/webp' });

        // Initialize S3 client
        const s3Client = new S3Client({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });

        // Generate the presigned URL for S3 upload
        const fileName = `${file.name?.split('.')[0]}.webp`;
        const params: PutObjectCommandInput = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            ContentType: webpFile.type,
        };
        const command = new PutObjectCommand(params);
        const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });

        if (!uploadURL) {
            return NextResponse.json({ error: 'Failed to get presigned URL' }, { status: 500 });
        }

        // Upload the WebP file to S3
        const uploadResponse = await fetch(uploadURL, {
            method: 'PUT',
            headers: {
                'Content-Type': webpFile.type,
            },
            body: webpFile,
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Failed to upload file: ${errorText}`);
        }

        // Return the S3 file key as the URL
        return NextResponse.json({ url: fileName });
    } catch (error) {
        console.error('Error during file upload:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
