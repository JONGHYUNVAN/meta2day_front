'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';

interface Alarm {
    id: number;
    type: string;
    postId: number;
    isRead: boolean;
    sendCheck: boolean;
}

const AlarmForm: React.FC = () => {
    const [notifications, setNotifications] = useState<Alarm[]>([]);
    const { user } = useAuth();

    // 서버로부터 알람 목록을 가져오는 함수
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const nickname = user?.nickname;
                if (!nickname || !token) return; // nickname이나 token이 없을 경우 early return

                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/user/${nickname}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data); 
                setNotifications(response.data); // 가져온 데이터를 상태에 저장
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        fetchNotifications(); // 컴포넌트가 마운트될 때 알람을 가져옴
    }, [user]);
    // 알림을 삭제하는 함수
    const deleteNotification = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // 삭제 후 상태에서 해당 알림 제거
            setNotifications((prev) => prev.filter((notification) => notification.id !== id));
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };
    // 알림을 읽음 처리하는 함수
    const markAsRead = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/${id}`, {
                isRead: true,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // 읽음 처리 후 상태 업데이트
            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === id ? { ...notification, isRead: true } : notification
                )
            );
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <div className="relative mt-32 max-w-6xl w-full font-serif opacity-80 hover:opacity-90 transition-opacity duration-200 shadow-md rounded-lg">
                <div className="metalic-bar absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-t-lg shadow-metallic">
                    <div className="absolute top-2 left-3 flex space-x-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full neon-effect-red"></span>
                        <span className="w-3 h-3 bg-yellow-500 rounded-full neon-effect-yellow"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full neon-effect-green"></span>
                    </div>
                </div>
                
                <div className="content-container mt-12 bg-[#191919] p-4 rounded-b-lg h-[calc(100%-64px)] overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-6 text-white">알림 목록</h1>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification.id} className="bg-white shadow-md p-3 mb-2 rounded-md">
                                <p className="text-black"><strong>Type:</strong> {notification.type}</p>
                                <p className="text-black"><strong>Post ID:</strong> {notification.postId}</p>
                                <p className="text-black"><strong>Read:</strong> {notification.isRead ? 'Yes' : 'No'}</p>
                            {/* 읽음 처리 버튼 */}
                            <button
                                    onClick={() => markAsRead(notification.id)}
                                    className={`text-white px-4 py-2 mr-2 rounded ${notification.isRead ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'}`}
                                    disabled={notification.isRead} // 이미 읽은 알림은 버튼 비활성화
                                >
                                    {notification.isRead ? '읽음 처리됨' : '읽음 처리'}
                                </button>
                                
                                
                            <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
                                >
                                    삭제
                            </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">알림이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlarmForm;
