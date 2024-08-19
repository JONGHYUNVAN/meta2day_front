import React from 'react';
import AlarmList from './alarmList'; // AlarmList.tsx를 가져옵니다.
import RealtimeAlarm from './realtimeAlarm';

const AlarmPage: React.FC = () => {
    const userId = 1; // 실제 사용자의 ID로 대체
    return (
        <div className="h-auto mt-48 flex items-center justify-center bg-transparent">
            <div className="relative max-w-6xl w-full font-serif opacity-80 hover:opacity-90 transition-opacity duration-200 shadow-md rounded-lg">
                <div className="metalic-bar absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-t-lg shadow-metallic">
                    <div className="absolute top-2 left-3 flex space-x-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full neon-effect-red"></span>
                        <span className="w-3 h-3 bg-yellow-500 rounded-full neon-effect-yellow"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full neon-effect-green"></span>
                    </div>
                </div>
                <div className="content-container mt-12 bg-[#191919] p-4 rounded-b-lg animate-unfold">
                    <h1 className="text-2xl font-bold mb-6 text-white">알림</h1>
                    <AlarmList /> {/* 알림 목록을 렌더링 */}
                    <RealtimeAlarm userId={userId} />
                </div>
            </div>
        </div>
    );
};

export default AlarmPage;
