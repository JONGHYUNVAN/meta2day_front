'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { markAllAsRead } from '@/store/slices/notificationSlice';

interface AlarmItemProps {
    alarm: {
        id: number;
        title: string;
        description: string;
        isNew: boolean;
        type: 'recommendation' | 'comment';
        relatedLink: string;
    };
    onDelete: () => void;
}

const AlarmItem: React.FC<AlarmItemProps> = ({ alarm, onDelete }) => {
    const [isRead, setIsRead] = useState(!alarm.isNew);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleRead = () => {
        setIsRead(true);
        dispatch(markAllAsRead()); // 모든 알람을 읽음 상태로 설정
    };

    const handleClick = () => {
        router.push(alarm.relatedLink);
    };

    return (
        <li className="flex justify-between items-start p-4 bg-gray-100 rounded-lg space-x-4">
            {!isRead && <span className="text-red-500">•</span>}
            <img src="/icons/alarm-icon.png" alt="alarm icon" className="w-6 h-6" />
            <div className="flex-1">
                <div className="font-semibold">{alarm.title}</div>
                <p onClick={handleClick} className="text-sm text-gray-600 cursor-pointer hover:underline">
                    {alarm.description}
                </p>
            </div>
            <div className="flex space-x-2">
                {!isRead && (
                    <button onClick={handleRead} className="text-green-500">
                        ✔확인
                    </button>
                )}
                <button onClick={onDelete} className="text-red-500">
                    ✖삭제
                </button>
            </div>
        </li>
    );
};

export default AlarmItem;
