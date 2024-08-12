//알림 항목 반복 렌더링
import React from 'react';
import AlarmItem from './alarmItem';

const AlarmList: React.FC = () => {
    const alarms = [
        { id: 1, title: '새로운 추천 항목 알림', description: '새로운 추천 항목 알림 새로운 추천 항목 알림', isNew: true },
        { id: 2, title: '댓글 및 리뷰 알림', description: '댓글 및 리뷰 알림 댓글 및 리뷰 알림', isNew: false },
        // 더미 데이터 
    ];

    return (
        <ul className="space-y-4">
            {alarms.map(alarm => (
                <AlarmItem key={alarm.id} alarm={alarm} />
            ))}
        </ul>
    );
};

export default AlarmList;
