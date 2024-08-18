import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: "ap-northeast-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

interface GeneratePresignedUrlResult {
    uploadURL: string;
    key: string;
}

export const generatePresignedUrl = async (
    fileName: string,
    fileType: string
): Promise<GeneratePresignedUrlResult> => {
    const params: PutObjectCommandInput = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileName,
        ContentType: fileType,
    };

    const command = new PutObjectCommand(params);
    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    return { uploadURL, key: fileName };
};