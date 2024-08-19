import sharp from 'sharp';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const inputBuffer = await file.arrayBuffer();

        const outputBuffer = await sharp(Buffer.from(inputBuffer))
            .webp()
            .toBuffer();

        return new Response(outputBuffer, {
            headers: {
                'Content-Type': 'image/webp',
            },
        });
    } catch (error:any) {
        return NextResponse.json({ error: 'Error converting image', details: error.message }, { status: 500 });
    }
}