import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeJwt } from 'jose';

interface User {
    nickname: string;
    role: string;
}

interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;
}

interface TokenPayload {
    nickname: string;
    email: string;
    sub: string;
    role: string;
}

const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
    token: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            const token = localStorage.getItem('token');

            if(token) {
                const decoded = decodeJwt(token) as TokenPayload;
                const nickname = decoded.nickname;
                const role = decoded.role;

                state.isLoggedIn = true;
                state.user = {nickname, role};
                state.token = token;
            }
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
