'use client';

import React, { useEffect, useState } from 'react';
import AlarmItem from './alarmItem';
import { EventSourcePolyfill } from 'event-source-polyfill';
import jwtDecode from 'jwt-decode';
interface Alarm {
    id: number;
    title: string;
    description: string;
    isNew: boolean;
    type: string;
    relatedLink: string;
}

interface DecodedToken {
    userId: number;
    // 다른 JWT에 포함된 필드가 있다면 여기에 추가
}

const AlarmList: React.FC = () => {
    const [alarms, setAlarms] = useState<Alarm[]>([]);

    useEffect(() => {
        // 토큰에서 사용자 ID 추출
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode<DecodedToken>(token);
            const userId = decoded.userId;

            // SSE 연결 설정
            const eventSource = new EventSourcePolyfill(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarms/sse/${userId}`);

            // 서버에서 새로운 알림이 오면 처리하는 로직
            eventSource.onmessage = (event) => {
                const newAlarm = JSON.parse(event.data);
                setAlarms((prevAlarms) => [newAlarm, ...prevAlarms]); // 새로운 알림을 추가
            };

            // 컴포넌트가 언마운트 될 때 이벤트 소스를 닫습니다.
            return () => {
                eventSource.close();
            };
        } else {
            console.error('토큰이 없습니다.');
        }
    }, []);

    return (
        <ul className="space-y-4">
            {alarms.map((alarm, index) => (
                <AlarmItem key={index} alarm={alarm} />
            ))}
        </ul>
    );
};

export default AlarmList;
