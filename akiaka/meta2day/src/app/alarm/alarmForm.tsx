'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Alarm {
    id: number;
    type: string;
    postId: number;
    isRead: boolean;
    sendCheck: boolean;
}

const AlarmForm: React.FC = () => {
    const [notifications, setNotifications] = useState<Alarm[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alarm/user/${localStorage.getItem('nickname')}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNotifications(response.data);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        fetchNotifications();
    }, []);

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
                    <h1 className="text-2xl font-bold mb-6 text-white">알림 목록</h1>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification.id} className="bg-white shadow-md p-3 mb-2 rounded-md">
                                <p className="text-black"><strong>Type:</strong> {notification.type}</p>
                                <p className="text-black"><strong>Post ID:</strong> {notification.postId}</p>
                                <p className="text-black"><strong>Read:</strong> {notification.isRead ? 'Yes' : 'No'}</p>
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
