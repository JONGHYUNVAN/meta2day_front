'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useForm} from 'react-hook-form';
import { useAuthRedirect} from "@/hooks/useAuthRedirect";
import useRefreshToken from '@/hooks/useRefreshToken';
import Swal from 'sweetalert2';


interface UserInfo {
    id: number;
    name: string;
    nickname: string;
    email: string;
    gender: string;
    ageGroup: number;
    mbti: string;
    characterId: number;
    voiceTypeId: number;
    categoryId: number;
    role: string;
}

interface IFormInput {
    nickname: string;
    ageGroup: number;
    mbti: string;
    characterId: number;
    categoryId: number;
}

const MyInfo: React.FC = () => {
    useAuthRedirect();
    const refresh = useRefreshToken();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [displayedText, setDisplayedText] = useState<string>('');
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const { setValue, formState: { errors } } = useForm<IFormInput>();

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

                setValue('nickname', response.data.nickname);
                setValue('ageGroup', response.data.ageGroup);
                setValue('mbti', response.data.mbti);
                setValue('characterId', response.data.characterId);
                setValue('categoryId', response.data.categoryId);
            } catch (error:any) {
                if (error.response?.status === 401) {
                    await refresh();
                    Swal.fire({
                        title: 'Token Refreshed',
                        text: '토큰이 갱신되었습니다. 다시 시도해 주세요.',
                        icon: 'info',
                        confirmButtonText: '확인',
                    });
                    return;
                }
                await Swal.fire({
                    title: 'Server Error',
                    text: '사용자 정보를 가져오는 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                });
            }
        };

        fetchUserInfo();
    }, [setValue]);

    useEffect(() => {
        if (userInfo) {
            const categoryMap: Record<number, string> = {
                1: "영화",
                2: "음악",
                3: "책"
            };

            const fullText =
                `Name: ${userInfo.name ? userInfo.name : "name not updated yet"}\n` +
                `Nickname: ${userInfo.nickname}\n` +
                `Email: ${userInfo.email}\n` +
                `Gender: ${userInfo.gender}\n` +
                `Age Group: ${userInfo.ageGroup}\n` +
                `MBTI: ${userInfo.mbti}\n` +
                `Category: ${categoryMap[userInfo.categoryId]}\n` +
                `Role: ${userInfo.role}\n`;

            const interval = setInterval(() => {
                setDisplayedText(prev => prev + fullText[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 10);

            if (currentIndex >= fullText.length) {
                clearInterval(interval);
            }

            return () => clearInterval(interval);
        }
    }, [currentIndex, userInfo]);

    return (
        <div className="relative ml-[3vh] p-8 bg-[#191919] h-auto rounded-2xl shadow-md max-w-3xl flex items-center">
            <div className="flex-shrink-0 animate-slide-in">
                <Image
                    src={`/profile${userInfo?.characterId}.webp`}
                    alt={`now loading`}
                    width={300}
                    height={500}
                    className="rounded-3xl h-[50vh] max-h-[500px] w-auto"
                />
            </div>

            <div className="ml-6 flex-grow">
                <pre className="text-left text-3xl ml-[3vw] font-handwriting neon-text-normal opacity-80"
                     style={{lineHeight: 'clamp(1rem, 5vh, 4rem)'}}>
                    {displayedText}
                </pre>
            </div>
        </div>
    );

};

export default MyInfo;
