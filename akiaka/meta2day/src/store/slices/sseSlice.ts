import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SseState {
    isConnected: boolean;
}

const initialState: SseState = {
    isConnected: false,
};

export const sseSlice = createSlice({
    name: 'sse',
    initialState,
    reducers: {
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
    },
});

export const { setConnected } = sseSlice.actions;
export default sseSlice.reducer;
