import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const { code } = await request.json();

    const url = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
        code,
    });


    try {
        const response = await axios.post(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const accessToken = response.data.access_token;

        const backendResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/oauth/google`, {}, {
            headers: {
                Authorization: `${accessToken}`,
            },
        });

        const finalToken = backendResponse.headers['authorization'];

        const responseHeaders = new Headers();
        responseHeaders.set('Authorization', finalToken);
        responseHeaders.set('Access-Control-Expose-Headers', 'Authorization');

        return new NextResponse(null, {
            status: 200,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error('Error during Google authentication:', error.response?.data || error.message);
        return NextResponse.error();
    }
}
