'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
interface UserInfo {
    id: number;
    name: string;
    nickname: string;
    email: string;
    gender: string;
    ageGroup: string;
    mbti: string;
    characterId: number;
    voiceTypeId: number;
    categoryId: number;
    role: string;
}

const MyInfo: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [displayedText, setDisplayedText] = useState<string>('');
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [showImage, setShowImage] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo) {
            const categoryMap: Record<number, string> = {
                1: "영화",
                2: "음악",
                3: "책"
            };

            const fullText = `
                Name: ${userInfo.name}\n
                Nickname: ${userInfo.nickname}\n
                Email: ${userInfo.email}\n
                Gender: ${userInfo.gender}\n
                Age Group: ${userInfo.ageGroup}\n
                MBTI: ${userInfo.mbti}\n
                Category: ${categoryMap[userInfo.categoryId]}\n
                Role: ${userInfo.role}\n
                Character: 
            `;

            const interval = setInterval(() => {
                setDisplayedText(prev => prev + fullText[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 10);

            if (currentIndex >= fullText.length) {
                clearInterval(interval);
                setShowImage(true);
            }

            return () => clearInterval(interval);
        }
    }, [currentIndex, userInfo]);

    return (
        <div className="p-8 bg-[#191919] h-auto rounded-lg shadow-md max-w-2xl text-left">
            <pre className="text-left text-3xl Nanum-Pen-Script neon-text-normal opacity-80 " style={{ lineHeight: '0.9' }}>
                {displayedText}
            </pre>
            {showImage && userInfo && (
                <Image
                    src={`/character${userInfo.characterId}.webp`}
                    alt={`Character ${userInfo.characterId}`}
                    width={50}
                    height={50}
                    className="rounded-full ml-64 -mt-16"
                />
            )}
        </div>
    );
};

export default MyInfo;
