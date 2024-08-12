"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AlarmItemProps {
    alarm: {
        id: number;
        title: string;
        description: string;
        isNew: boolean;
        type: 'recommendation' | 'comment';
        relatedLink: string;
    };
    onDelete: () => void;  // 삭제 함수 prop
}

const AlarmItem: React.FC<AlarmItemProps> = ({ alarm, onDelete }) => {
    const [isRead, setIsRead] = useState(!alarm.isNew);
    const router = useRouter();

    const handleRead = () => {
        setIsRead(true);
    };

    const handleClick = () => {
        router.push(alarm.relatedLink);
    };

    const icon = alarm.type === 'recommendation' 
        ? '/icons/recommendation-icon.svg' 
        : '/icons/comment-icon.svg';

    const alarmTitle = alarm.type === 'recommendation'
        ? '새로운 추천 항목 알림'
        : '댓글 및 리뷰 알림';

    return (
        <li className="flex justify-between items-start p-4 bg-gray-100 rounded-lg space-x-4">
            {!isRead && <span className="text-red-500">•</span>}
            <img src={icon} alt="alarm icon" className="w-6 h-6" />
            <div className="flex-1">
                <div className="font-semibold">{alarmTitle}</div>
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
