"use client";
import React, { useState } from 'react';
import AlarmItem from './alarmItem';

const AlarmList: React.FC = () => {
    // 상태로 알람 목록 관리
    const [alarms, setAlarms] = useState([
        {
            id: 1,
            title: '새로운 추천 항목 알림',
            description: '인사이드 아웃이 새로운 추천 항목에 추가되었습니다.',
            isNew: true,
            type: 'recommendation',
            relatedLink: '/details/inside-out'
        },
        {
            id: 2,
            title: '댓글 및 리뷰 알림',
            description: '인사이드 아웃에 댓글(리뷰)이 추가되었습니다.',
            isNew: false,
            type: 'comment',
            relatedLink: '/details/inside-out'
        },
        // 추가 알람 항목들...
    ]);

    // 특정 알람을 삭제하는 함수
    const handleDelete = (id: number) => {
        setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== id));
    };

    return (
        <ul className="space-y-4">
            {alarms.map(alarm => (
                <AlarmItem key={alarm.id} alarm={alarm} onDelete={() => handleDelete(alarm.id)} />
            ))}
        </ul>
    );
};

export default AlarmList;
