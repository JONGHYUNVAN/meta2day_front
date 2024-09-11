'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUnreadStatus } from '@/store/slices/notificationSlice';
import useAuth from '@/hooks/useAuth';

interface Alarm {
    id: number;
    type: string;
    postTitle: string;
    postId?: number;
    isRead: boolean;
    sendCheck: boolean;
    createdAt: string;
}

const AlarmForm: React.FC = () => {
    const [notifications, setNotifications] = useState<Alarm[]>([]);
    const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]); // 체크된 알림 ID 저장
    const { user } = useAuth();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const nickname = user?.nickname;
                if (!nickname || !token) return;

                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/user/${nickname}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setNotifications(response.data);

                const unreadExists = response.data.some((notification: Alarm) => !notification.isRead);
                dispatch(setUnreadStatus(unreadExists));
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };

        fetchNotifications();
    }, [user, dispatch]);

    // 알림 선택 시 처리
    const toggleSelection = (id: number) => {
        setSelectedNotifications((prevSelected) => 
            prevSelected.includes(id) 
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    // 선택된 알림 읽음 처리 함수
    const markSelectedAsRead = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await Promise.all(
                selectedNotifications.map(async (id) => {
                    await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/${id}`, {
                        isRead: true,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                })
            );

            // 상태 업데이트
            setNotifications((prev) =>
                prev.map((notification) =>
                    selectedNotifications.includes(notification.id)
                        ? { ...notification, isRead: true }
                        : notification
                )
            );

            setSelectedNotifications([]); // 선택 초기화
            const unreadExists = notifications.some(notification => !notification.isRead);
            dispatch(setUnreadStatus(unreadExists));
        } catch (error) {
            console.error('Failed to mark notifications as read', error);
        }
    };

    // 전체 알림을 삭제하는 함수
    const deleteAllNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const nickname = user?.nickname;
            if (!nickname || !token) return;

            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/user/${nickname}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setNotifications([]); // 전체 알림 삭제 후 알림 목록 초기화
        } catch (error) {
            console.error('Failed to delete all notifications', error);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Invalid date';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        };
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString('ko-KR', options);
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
                        <>
                            {notifications.map((notification) => (
                                <div 
                                key={notification.id} 
                                className={`flex items-center bg-white shadow-md p-3 mb-2 rounded-md cursor-pointer ${notification.isRead ? 'bg-gray-100' : 'bg-white'}`} 
                                >
                                    {/* 체크박스 추가 */}
                                    <input 
                                        type="checkbox" 
                                        className="mr-4"
                                        checked={selectedNotifications.includes(notification.id)}
                                        onChange={() => toggleSelection(notification.id)}
                                    />

                                    <div className="flex-1" onClick={() => router.push(`/post/${notification.postId}`)}>
                                        {/* 알림 메시지 */}
                                        {notification.type === 'comment' ? (
                                            <p className="text-black">{notification.postTitle}에 새로운 댓글이 달렸습니다!</p>
                                        ) : (
                                            <p className="text-black">알림 타입: {notification.type}</p>
                                        )}
                                        <p>{formatDate(notification.createdAt)}</p>
                                    </div>
                                </div>
                            ))}

                            {/* 선택된 알림 읽음 처리 버튼 */}
                            {selectedNotifications.length > 0 && (
                                <button
                                    onClick={markSelectedAsRead}
                                    className="text-white bg-green-500 hover:bg-green-700 px-4 py-2 rounded mt-4"
                                >
                                    선택된 알림 읽음 처리
                                </button>
                            )}

                            {/* 전체 삭제 버튼 추가 */}
                            <button
                                onClick={deleteAllNotifications}
                                className="text-white bg-red-600 hover:bg-red-800 px-4 py-2 rounded mt-4"
                            >
                                전체 삭제
                            </button>
                        </>
                    ) : (
                        <p className="text-white">알림이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlarmForm;
