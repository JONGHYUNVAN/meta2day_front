'use client'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store'; // store 경로에 맞게 설정
import './SSE.css';

const Sse: React.FC = () => {
    const [notifications, setNotifications] = useState<string[]>([]);
    
    // Redux에서 현재 로그인된 사용자의 정보를 가져옴
    const user = useSelector((state: RootState) => state.auth.user);
    const nickname = user?.nickname;

    useEffect(() => {
        if (!nickname) return;

        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/sse/${nickname}`);

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
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [nickname]);

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
