// store/slices/notificationSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface NotificationState {
    hasUnread: boolean;
}

const initialState: NotificationState = {
    hasUnread: true, // 기본적으로 빨간 점을 보이도록 설정
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        markAllAsRead: (state) => {
            state.hasUnread = false; // 모든 알림을 읽음 처리
        },
        setUnreadStatus: (state, action) => {
            state.hasUnread = action.payload; // 동적으로 읽음/안 읽음 상태 설정
        },
    },
});

export const { markAllAsRead, setUnreadStatus } = notificationSlice.actions;
export default notificationSlice.reducer;
