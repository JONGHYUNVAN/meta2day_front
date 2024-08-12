'use client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
        }
    };

    return { isLoggedIn, user, handleLogout };
};

export default useAuth;