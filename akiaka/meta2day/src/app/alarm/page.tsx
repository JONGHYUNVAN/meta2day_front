//알림페이지 레이아웃 설정
import React from 'react';
import AlarmList from './alarmList';

const AlarmPage: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-6">알림</h1>
                <AlarmList />
            </div>
        </div>
    );
};

export default AlarmPage;
