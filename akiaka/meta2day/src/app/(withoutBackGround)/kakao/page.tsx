'use client';

import { useEffect , Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import Swal from "sweetalert2";

function KakaoLoginComponent() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (code) {
            axios.post('/api/kakao', { code },{ withCredentials: true })
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
                    Swal.fire({
                        title: 'Failed to Login',
                        text: `오류 메시지: ${error.message}`,
                        icon: 'error',
                        confirmButtonText: '확인',
                    });
                });
        }
    }, [code, router, dispatch]);

    return null;
}

export default function KakaoLogin() {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-yellow-400">
            <Suspense fallback={<div className="text-4xl text-center">Waiting for Kakao fallback...</div>}>
                <div className="text-4xl Nanum-Pen-Script text-center text-orange-900">Kakao Loging... please wait</div>
                <KakaoLoginComponent/>
            </Suspense>
        </div>
    );
}
