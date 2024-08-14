'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';

function GoogleLoginComponent() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (code) {
            axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/oauth/google`, { code })
                .then(response => {
                    const token = response.headers.authorization;
                    if (token) {
                        localStorage.setItem('token', token);
                        dispatch(login());
                        window.close();
                        router.push('/myPage');
                    }
                })
                .catch(error => {
                    console.error('로그인 실패:', error);
                    router.push('/login');
                });
        }
    }, [code, router, dispatch]);

    return null;
}

export default function GoogleLogin() {
    return (
        <div>
            <GoogleLoginComponent />
            <div>Logging...in</div>
        </div>
    );
}
