'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Alarm {
    id: number;
    title: string;
    description: string;
    type: string;
    isNew: boolean;
}

const AlarmList: React.FC = () => {
    const [alarms, setAlarms] = useState<Alarm[]>([]);

    useEffect(() => {
        const fetchAlarms = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/user/1`);
                setAlarms(response.data);
            } catch (error) {
                console.error('Failed to fetch alarms', error);

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
                setAlarms(dummyAlarms);
            }
        };

        fetchAlarms();
    }, []);

    const handleConfirm = (id: number) => {
        axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/${id}`, { isNew: false })
            .then(() => {
                setAlarms(alarms.map(alarm => (alarm.id === id ? { ...alarm, isNew: false } : alarm)));
            })
            .catch(error => console.error('Failed to confirm alarm', error));
    };

    const handleDelete = (id: number) => {
        axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/${id}`)
            .then(() => {
                setAlarms(alarms.filter(alarm => alarm.id !== id));
            })
            .catch(error => console.error('Failed to delete alarm', error));
    };

    return (
        <ul>
            {alarms.map(alarm => (
                <li key={alarm.id} className="flex items-center p-4 mb-4 rounded-lg shadow bg-[#212121] text-white">
                    <span className="relative mr-4">
                        {alarm.isNew && (
                            <span className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </span>
                    <div className="flex-1">
                        <h4 className="font-bold">{alarm.title}</h4>
                        <p className="text-sm">{alarm.description}</p>
                        <div className="mt-2">
                            <button
                                onClick={() => handleConfirm(alarm.id)}
                                className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all duration-200"
                            >
                                확인
                            </button>
                            <button
                                onClick={() => handleDelete(alarm.id)}
                                className="px-4 py-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition-all duration-200"
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
