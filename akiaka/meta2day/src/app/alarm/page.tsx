
import React from 'react';
import AlarmList from './alarmList'; // AlarmList.tsx를 가져옵니다.
import RealtimeAlarm from './realtimeAlarm'; 
const AlarmPage: React.FC = () => {
    const userId = 1; // 실제 사용자의 ID로 대체
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-6">알림</h1>
                <AlarmList /> {/* 알림 목록을 렌더링 */}
                <RealtimeAlarm userId={userId} />
            </div>
        </div>
    );
};

export default AlarmPage;