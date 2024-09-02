'use client'

import axios from 'axios';
import {useDispatch} from 'react-redux';
import {login, logout} from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2";

const useRefreshToken = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    return async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,{}, {withCredentials: true});
            const newAccessToken = response.headers['authorization'];
            if(!newAccessToken) {
                await Swal.fire({
                    title: 'Token Refresh Failed',
                    text: '토큰 갱신에 실패했습니다. 다시 로그인 해주세요.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });                dispatch(logout());
                router.push('/login');
            }

            localStorage.setItem('token', newAccessToken);
            dispatch(login());

            return newAccessToken;
        } catch (error) {
            await Swal.fire({
                title: 'Token Expired',
                text: '리프레시 토큰이 만료되었습니다. 다시 로그인 해주세요.',
                icon: 'error',
                confirmButtonText: '확인',
            });
            dispatch(logout());
            throw error;
        }
    };
};

export default useRefreshToken;