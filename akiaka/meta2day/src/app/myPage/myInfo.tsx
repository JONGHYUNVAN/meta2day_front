'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';

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
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [displayedText, setDisplayedText] = useState<string>('');
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<IFormInput>();

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

                // Set initial form values
                setValue('nickname', response.data.nickname);
                setValue('ageGroup', response.data.ageGroup);
                setValue('mbti', response.data.mbti);
                setValue('characterId', response.data.characterId);
                setValue('categoryId', response.data.categoryId);
            } catch (error) {
                console.error('Error fetching user info:', error);
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
                `Name: ${userInfo.name}\n` +
                `Nickname: ${userInfo.nickname}\n` +
                `Email: ${userInfo.email}\n` +
                `Gender: ${userInfo.gender}\n` +
                `Age Group: ${userInfo.ageGroup}\n` +
                `MBTI: ${userInfo.mbti}\n` +
                `Category: ${categoryMap[userInfo.categoryId]}\n` +
                `Role: ${userInfo.role}\n` +
                `Character:`;

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

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userInfo?.id}`, data, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            // Re-fetch user info after update
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            setUserInfo(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user info:', error);
        }
    };

    return (
        <div className="relative p-8 bg-[#191919] h-auto rounded-lg shadow-md max-w-2xl text-left">
            <pre className="text-left text-3xl Nanum-Pen-Script neon-text-normal opacity-80 leading-normal">
                {displayedText}
            </pre>
            {showImage && userInfo && (
                <Image
                    src={`/character${userInfo.characterId}.webp`}
                    alt={`Character ${userInfo.characterId}`}
                    width={50}
                    height={50}
                    className="rounded-full ml-32 -mt-14"
                />
            )}
            <button
                onClick={handleEditClick}
                className="absolute bottom-2 right-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition duration-200"
            >
                Edit
            </button>
            {isEditing && (
                <form onSubmit={handleSubmit(onSubmit)}
                      className="absolute top-0 right-0 flex items-center mt-8 mr-8 p-4 rounded-lg shadow-md z-10 bg-transparent">
                    <div className="mr-4 text-5xl neon-text-normal">→</div>
                    <div className="flex flex-col space-y-2 bg-transparent">
                        <input
                            {...register('nickname', { required: 'Nickname is required' })}
                            type="text"
                            placeholder="Edit Nickname"
                            className={`p-2 border border-gray-300 neon-text-normal rounded-md bg-transparent ${errors.nickname ? 'border-red-500' : ''}`}
                        />
                        <input
                            {...register('ageGroup', { required: 'Age Group is required', valueAsNumber: true })}
                            type="number"
                            placeholder="Edit Age Group"
                            className={`p-2 border border-gray-300 neon-text-normal rounded-md bg-transparent ${errors.ageGroup ? 'border-red-500' : ''}`}
                        />
                        <input
                            {...register('mbti', { required: 'MBTI is required' })}
                            type="text"
                            placeholder="Edit MBTI"
                            className={`p-2 border border-gray-300 neon-text-normal rounded-md bg-transparent ${errors.mbti ? 'border-red-500' : ''}`}
                        />
                        <input
                            {...register('characterId', { required: 'Character ID is required', valueAsNumber: true })}
                            type="number"
                            placeholder="Edit Character ID"
                            className={`p-2 border border-gray-300 neon-text-normal rounded-md bg-transparent ${errors.characterId ? 'border-red-500' : ''}`}
                        />
                        <input
                            {...register('categoryId', { required: 'Category ID is required', valueAsNumber: true })}
                            type="number"
                            placeholder="Edit Category ID"
                            className={`p-2 border border-gray-300 neon-text-normal rounded-md bg-transparent ${errors.categoryId ? 'border-red-500' : ''}`}
                        />
                    </div>
                    <button
                        type="submit"
                        className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition duration-200"
                    >
                        Save
                    </button>
                </form>
            )}
        </div>
    );
};

export default MyInfo;
