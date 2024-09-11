'use client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { login, logout } from '@/store/slices/authSlice';
import Swal from 'sweetalert2';

const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const { isLoggedIn, user, token, isAdmin } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        Swal.fire({
            title: 'Logout Success! See you again!',
            text: '로그아웃 되었습니다. 다음에 또 만나요!',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
        });
    };

    return { isLoggedIn, isAdmin, user, token, handleLogout };
};

export default useAuth;