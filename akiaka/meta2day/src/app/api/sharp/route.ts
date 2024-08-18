import sharp from 'sharp';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { imagePath } = await req.json();
        const inputFilePath = path.resolve(imagePath);
        const outputFilePath = inputFilePath.replace(/\.[^/.]+$/, ".webp");

        await sharp(inputFilePath)
            .toFormat('webp')
            .toFile(outputFilePath);

        return NextResponse.json({ message: 'Image converted to WebP successfully', outputFilePath });
    } catch (error:any) {
        return NextResponse.json({ error: 'Error converting image', details: error.message }, { status: 500 });
    }
}
