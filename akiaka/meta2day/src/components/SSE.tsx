'use client'
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setConnected } from '@/store/slices/sseSlice'; // sseSlice에서 액션 가져오기
import './SSE.css';

interface Alarm {
    id: number;
    type: string;
    postId: number;
    isRead: boolean;
    sendCheck: boolean;
}

const Sse: React.FC = () => {
    const [notifications, setNotifications] = useState<string[]>([]);
    const user = useSelector((state: RootState) => state.auth.user);
    const isConnected = useSelector((state: RootState) => state.sse.isConnected);
    const dispatch = useDispatch<AppDispatch>();
    const nickname = user?.nickname;

    useEffect(() => {
        console.log(nickname);
        console.log(isConnected)
        if (!nickname || isConnected) return;

        console.log("렌더링 !!! ")
        console.log(user)

        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/sse/${nickname}`);
        dispatch(setConnected(true));  // Redux 스토어에 연결 상태를 설정

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('New Alarm:', data);
            setNotifications(prev => [...prev, data.message]); // 알림을 상태에 추가
            // 5초 후에 알림을 자동으로 제거
            setTimeout(() => {
                setNotifications(prev => prev.slice(1));
            }, 5000);

        };

        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            dispatch(setConnected(false));  // Redux 스토어에 연결 상태를 해제
            eventSource.close();
        };

        return () => {
            console.log("[SSE] 연결 끊김 :" + nickname);
            dispatch(setConnected(false));  // Redux 스토어에 연결 상태를 해제
            eventSource.close();
        };
    }, [isConnected]);

    return (
        <div>
            {notifications.map((message, index) => (
                <div key={index} className="notification-slide">
                    {message}
                </div>
            ))}
        </div>
    );
};

export default Sse;
