//개별 알림 항목 표시
import React from 'react';

interface AlarmItemProps {
    alarm: {
        id: number;
        title: string;
        description: string;
        isNew: boolean;
    };
}

const AlarmItem: React.FC<AlarmItemProps> = ({ alarm }) => {
    return (
        <li className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center">
                {alarm.isNew && <span className="text-red-500 mr-2">•</span>}
                <div className="flex flex-col">
                    <span className="font-semibold">{alarm.title}</span>
                    <span className="text-sm text-gray-600">{alarm.description}</span>
                </div>
            </div>
            <div className="flex space-x-4">
                {alarm.isNew && <button className="text-green-500">✔확인</button>}
                <button className="text-red-500">✖삭제</button>
            </div>
        </li>
    );
};

export default AlarmItem;
