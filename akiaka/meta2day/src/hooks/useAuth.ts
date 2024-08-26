'use client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { login, logout } from '@/store/slices/authSlice';
import { useEffect } from 'react';

const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const { isLoggedIn, user, token, isAdmin } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return { isLoggedIn, isAdmin, user, token, handleLogout };
};

export default useAuth;