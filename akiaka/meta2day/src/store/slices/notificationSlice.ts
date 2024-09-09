import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
    hasUnread: boolean;
}

const initialState: NotificationState = {
    hasUnread: true,  // 기본적으로 읽지 않은 알림이 있다고 가정
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        markAllAsRead(state) {
            state.hasUnread = false;  // 모든 알림이 읽혔음을 표시
        },
        addUnread(state) {
            state.hasUnread = true;  // 새로운 읽지 않은 알림이 생겼음을 표시
        },
    },
});

export const { markAllAsRead, addUnread } = notificationSlice.actions;
export default notificationSlice.reducer;
