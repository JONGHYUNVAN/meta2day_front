'use client'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import './SSE.css';

interface Alarm {
    id: number;
    type: string;
    postTitle: string; // postTitle 추가
    isRead: boolean;
    sendCheck: boolean;
}

const Sse: React.FC = () => {
    const [notifications, setNotifications] = useState<string[]>([]);
    
    // Redux에서 현재 로그인된 사용자의 정보를 가져옴
    const user = useSelector((state: RootState) => state.auth.user);
    const nickname = user?.nickname;

    useEffect(() => {
        if (!nickname) return;
        console.log("렌더링 !!! ")

        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/sse/${nickname}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('New Alarm:', data);
        
            // type이 comment일 때 {PostTitle}에 새로운 댓글이 달렸습니다! 형식으로 메시지 표시
            if (data.postTitle) {
                setNotifications(prev => [...prev, `${data.postTitle}에 새로운 댓글이 달렸습니다!`]);
            } else {
                setNotifications(prev => [...prev, data.message]); // 기본 메시지 처리
            }
        
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
            console.log("[SSE] 연결 끊김 :" + nickname);
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
