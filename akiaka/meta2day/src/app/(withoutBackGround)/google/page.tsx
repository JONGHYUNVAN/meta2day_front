'use client';

import { useEffect, Suspense } from 'react';
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
            axios.post('/api/google', { code },{ withCredentials: true })
                .then(response => {
                    console.log(response.data.token);
                    const finalToken = response.headers['authorization'];
                    if (finalToken) {
                        localStorage.setItem('token', finalToken);
                        dispatch(login());
                        window.close();
                    }
                })
                .catch(error => {
                    alert(`로그인 실패: ${error.message}`);
                });
        }
    }, [code, router, dispatch]);

    return null;
}

export default function GoogleLogin() {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-black">
            <Suspense fallback={<div className="text-4xl text-center">Waiting for Google fallback...</div>}>
                <div className="text-4xl font-serif text-center text-white">Google Logging... please wait</div>
                <GoogleLoginComponent/>
            </Suspense>
        </div>
    );
}
