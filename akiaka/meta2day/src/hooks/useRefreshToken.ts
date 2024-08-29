'use client'

import axios from 'axios';
import {useDispatch} from 'react-redux';
import {login, logout} from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

const useRefreshToken = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    return async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,{}, {withCredentials: true});
            const newAccessToken = response.headers['authorization'];
            if(!newAccessToken) {
                alert('토큰 갱신 실패. 다시 로그인 해주세요');
                dispatch(logout());
                router.push('/login');
            }

            localStorage.setItem('token', newAccessToken);
            dispatch(login());

            return newAccessToken;
        } catch (error) {
            console.error('리프레시 토큰 만료됨:', error);
            dispatch(logout());
            throw error;
        }
    };
};

export default useRefreshToken;