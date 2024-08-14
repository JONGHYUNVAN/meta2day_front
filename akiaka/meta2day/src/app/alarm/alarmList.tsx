'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Alarm {
    id: number;
    title: string;
    description: string;
    type: string;
    isNew: boolean;
    //relatedLink: string;
}

interface DecodedToken {
    userId: number;
    // 다른 JWT에 포함된 필드가 있다면 여기에 추가
}

const AlarmList: React.FC = () => {
    const [alarms, setAlarms] = useState<Alarm[]>([]);

    useEffect(() => {
        const fetchAlarms = async () => {
            console.log("Fetching alarms..."); // 로그 추가

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarms`);
                console.log("Fetched alarms:", response.data); // 로그 추가
                setAlarms(response.data);
            } catch (error) {
                console.error('Failed to fetch alarms', error);

                // 만약 서버에서 데이터를 가져오지 못하면 더미 데이터를 사용하도록 설정
                const dummyAlarms: Alarm[] = [
                    {
                        id: 1,
                        title: '새로운 추천 항목 알림',
                        description: '인사이드 아웃이 새로운 추천 항목에 추가되었습니다.',
                        type: 'recommendation',
                        isNew: true,
                    },
                    {
                        id: 2,
                        title: '댓글 알림',
                        description: '인사이드 아웃에 새로운 댓글이 추가되었습니다.',
                        type: 'comment',
                        isNew: true,
                    },
                    {   
                        id: 3,
                        title: '리뷰 알림',
                        description: '인사이드 아웃에 새로운 리뷰가 추가되었습니다.',
                        type: 'comment',
                        isNew: false,
                    },
                ];
                console.log("Using dummy alarms:", dummyAlarms); // 로그 추가
                setAlarms(dummyAlarms);
            }
        };

        fetchAlarms(); // `useEffect` 내부에서 fetchAlarms 함수를 호출하여 페이지 로드 시 데이터를 가져옵니다.
    }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 마운트될 때만 실행되도록 합니다.

    const handleConfirm = (id: number) => {
        console.log(`Confirming alarm with id: ${id}`); // 로그 추가
        axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarms/${id}`, { isNew: false })
            .then(() => {
                console.log(`Alarm with id: ${id} confirmed`); // 로그 추가
                setAlarms(alarms.map(alarm => (alarm.id === id ? { ...alarm, isNew: false } : alarm)));
            })
            .catch(error => console.error('Failed to confirm alarm', error)); // 오류 로그 추가
    };

    const handleDelete = (id: number) => {
        console.log(`Deleting alarm with id: ${id}`); // 로그 추가
        axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarms/${id}`)
            .then(() => {
                console.log(`Alarm with id: ${id} deleted`); // 로그 추가
                setAlarms(alarms.filter(alarm => alarm.id !== id));
            })
            .catch(error => console.error('Failed to delete alarm', error)); // 오류 로그 추가
    };

    return (
        <ul>
            {alarms.map(alarm => (
                <li key={alarm.id} className="flex items-center p-4 mb-4 bg-gray-100 rounded-lg shadow">
                    <span className="relative mr-4">
                        {alarm.isNew && (
                            <span className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </span>
                    <div className="flex-1">
                        <h4 className="font-bold">{alarm.title}</h4>
                        <p className="text-sm text-gray-600">{alarm.description}</p>
                        <div className="mt-2">
                            <button
                                onClick={() => handleConfirm(alarm.id)}
                                className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                                확인
                            </button>
                            <button
                                onClick={() => handleDelete(alarm.id)}
                                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default AlarmList;
