import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    nickname: string;
}

interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
}

const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ email: string, nickname: string }>) => {
            const email = action.payload.email;
            const nickname = action.payload.nickname;
            state.isLoggedIn = true;
            state.user = { nickname };
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;