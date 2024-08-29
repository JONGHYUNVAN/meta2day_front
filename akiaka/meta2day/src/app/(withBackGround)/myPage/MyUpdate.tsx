'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import {useAuthRedirect} from "@/hooks/useAuthRedirect";
import useRefreshToken from '@/hooks/useRefreshToken';

interface IFormInput {
    name?: string;
    nickname?: string;
    ageGroup?: number;
    gender: string;
    mbti?: string[];
    characterId?: number;
    categoryId?: number;
}

const MyUpdate: React.FC = () => {
    useAuthRedirect();
    const refresh = useRefreshToken();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<IFormInput>({
        mode: 'onChange',
    });
    const [serverError, setServerError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dataName, setDataName] = useState<string | null>(null);
    const [dataNickName, setDataNickName] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,{
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                const userData = response.data;
                setDataName(userData.name);
                setDataNickName(userData.nickname);
                setValue('name', '');
                setValue('nickname', '');
                setValue('gender', userData.gender);
                setValue('ageGroup', userData.ageGroup);
                setValue('categoryId', userData.categoryId);
                setSelectedCharacter(userData.characterId);

                const mbtiArray = userData.mbti ? userData.mbti.split('') : ['E', 'S', 'T', 'J'];
                setValue('mbti', mbtiArray);
            } catch (error:any) {
                if (error.response?.status === 401) {
                    await refresh();
                    alert('refreshed');
                    return;
                }
                setServerError(`${error.message}`);
            }
        };

        fetchData();
    }, [setValue]);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        if(isSubmitting) return;
        setIsSubmitting(true);

        try {
            let formattedData: any = {
                ...data,
                mbti: data.mbti?.join(''),
                characterId: selectedCharacter?.toString(),
                categoryId: selectedCategory?.toString(),
            };

            Object.keys(formattedData).forEach(key => {
                if (formattedData[key] === undefined || formattedData[key] === '' || formattedData[key] === null) {
                    delete formattedData[key];
                }
            });
            const token = localStorage.getItem('token')
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, formattedData, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (response.status === 200) {
                alert(`Update Complete!`)
                router.refresh();
            } else {
                setServerError('Update failed. Please try again.');
            }

        } catch (error:any) {
            setServerError(error.response.data.message);
        }finally {
            setIsSubmitting(false);
        }
    };

    const mbtiOptions = [
        ['E', 'I'],
        ['S', 'N'],
        ['T', 'F'],
        ['J', 'P']
    ];

    const mbti = watch('mbti', ['E', 'S', 'T', 'J']);

    const handleMbtiClick = (index: number) => {
        setActiveIndex(index);
        setTimeout(() => {
            const currentOptions = mbtiOptions[index];
            const currentIndex = mbti ? currentOptions.indexOf(mbti[index]) : 0;
            const newIndex = (currentIndex + 1) % currentOptions.length;
            const newMbti = mbti ? [...mbti]:[];
            newMbti[index] = currentOptions[newIndex];
            setValue('mbti', newMbti);
        }, 250);
        setTimeout(() => setActiveIndex(null), 300);
    };

    const handleCharacterClick = (id: number) => {
        setSelectedCharacter(id);
    };

    const handleCategoryClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(event.target.value, 10);
        if (!isNaN(selectedId)) {
            setSelectedCategory(selectedId);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}
              className="max-w-4xl w-full mx-auto mt-[0.5vh] p-[2vh] bg-[#191919] font-serif opacity-80 hover:opacity-90 transition-opacity duration-200 shadow-md rounded-lg">
            <h2 className="text-3xl font-bold neon-text text-center mb-[2vh]">Update Profile</h2>
            {serverError && <p className="text-red-500 text-center">{serverError}</p>}
            <div className="flex flex-col gap-[1.5vh]">
                <div>
                    <label htmlFor="name" className="block text-[1.25vh] neon-text-normal font-bold mb-[1vh]">
                        {errors.name ? <span className="text-red-500">{errors.name.message}</span> : 'Name'}
                    </label>
                    <input
                        {...register('name')}
                        type="text"
                        id="name"
                        placeholder={dataName || '이름을 등록해주세요'}
                        className={`w-full text-center text-black placeholder-black p-[1vh] border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        style={{minHeight: '1rem', maxHeight: '1.75rem'}}
                    />
                </div>
                <div>
                    <label htmlFor="nickname" className="block text-[1.25vh] neon-text-normal font-bold mb-[1vh]">
                        {errors.nickname ? <span className="text-red-500">{errors.nickname.message}</span> : 'Nickname'}
                    </label>
                    <input
                        {...register('nickname')}
                        type="text"
                        id="nickname"
                        placeholder={`${dataNickName}`}
                        className={`w-full text-center text-black placeholder-black p-[1vh] border rounded ${errors.nickname ? 'border-red-500' : 'border-gray-300'}`}
                        style={{minHeight: '1rem', maxHeight: '1.75rem'}}
                    />
                </div>

                <div>
                    <label htmlFor="gender"
                           className="block mt-[1vh] text-[1.25vh] neon-text-normal font-bold mb-[1vh]">Gender</label>
                    <div className="flex justify-center space-x-[2vh]">
                        <label className="inline-flex items-center">
                            <input
                                {...register('gender')}
                                type="radio"
                                value="Male"
                                className="form-radio"
                            />
                            <span className="ml-[1vh] text-[1.25vh] neon-text-normal">Male</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                {...register('gender')}
                                type="radio"
                                value="Female"
                                className="form-radio"
                            />
                            <span className="ml-[1vh] text-[1.25vh] neon-text-normal">Female</span>
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-2">

                    <div className={"ml-[1vw]"}>
                        <label htmlFor="ageGroup" className="block text-[1.25vh] neon-text-normal font-bold mb-[1vh]">Age
                            Group</label>
                        <select
                            {...register('ageGroup')}
                            id="ageGroup"
                            className={`w-10/12 text-center text-xl text-black Nanum-Pen-Script border min-h-96 rounded ${errors.ageGroup ? 'border-red-500' : 'border-gray-300'}`}
                            style={{minHeight: '1rem', maxHeight: '1.75rem'}}
                        >
                            <option value="">변경을 원하시면 연령대를 선택하세요</option>
                            <option value="10">10대</option>
                            <option value="20">20대</option>
                            <option value="30">30대</option>
                            <option value="40">40대 이상</option>
                        </select>
                    </div>

                    <div className={"ml-[1vw]"}>
                        <label htmlFor="categoryId" className="block text-[1.25vh] neon-text-normal font-bold mb-[1vh]">Favorite
                            Category</label>
                        <select
                            {...register('categoryId', {required: 'Favorite Category is required'})}
                            id="categoryId"
                            onChange={handleCategoryClick}
                            className={`w-full text-center text-xl Nanum-Pen-Script text-black min-h-96 border rounded ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                            style={{minHeight: '1rem', maxHeight: '1.75rem'}}
                        >
                            <option value="">변경을 원하시면 좋아하는 항목을 선택하세요</option>
                            <option value="1">Movie</option>
                            <option value="2">Music</option>
                            <option value="3">Book</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 ">
                        <div>
                            <label htmlFor="mbti"
                                   className="block text-[1.25vh] neon-text-normal font-bold mb-[1vh]" translate="no">MBTI</label>
                            <div className="flex justify-center space-x-[1.5vh] text-[1.25vh] neon-text-normal">
                                {mbti ? mbti.map((char, index) => (
                                    <div key={index} className="mbti-spin">
                                        <div
                                            onClick={() => handleMbtiClick(index)}
                                            className={`mbti-spin-inner ${activeIndex === index ? 'mbti-spin-active' : ''} cursor-pointer w-[4vh] max-w-20 h-[4vh] text-center border rounded border-gray-300 text-[2vh] flex items-center justify-center`}
                                            translate="no"
                                        >
                                            <div className={"mt-[0.5vh]"}>
                                                <span>{char}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (<></>)}
                            </div>
                        </div>


                        <div>
                            <label
                                htmlFor="characterId"
                                className="block text-[1.25vh] neon-text-normal font-bold mb-[1vh]"
                            >
                                Character
                            </label>
                            <div className="flex justify-center space-x-[2vh]">
                                {[1, 2, 3, 4, 5].map(id => (
                                    <div
                                        key={id}
                                        onClick={() => handleCharacterClick(id)}
                                        className={`cursor-pointer rounded-full transition-transform duration-200 ${selectedCharacter === id ? `transform scale-125 border-2 ${id === 1 ? 'border-yellow-500' : id === 2 ? 'border-red-500' : id === 3 ? 'border-green-500' : id === 4 ? 'border-blue-500' : 'border-purple-500'}` : 'border border-gray-300'}`}
                                    >
                                        <Image
                                            src={`/character${id}.webp`}
                                            alt={`Character ${id}`}
                                            width={50}
                                            height={50}
                                            className="rounded-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full mx-auto p-[1.5vh] mt-[2.5vh] mb-[1.5vh] border-2 border-teal-500 text-[1.25vh] text-white bg-transparent rounded-full cursor-pointer transition duration-200 hover:bg-teal-500 hover:border-teal-500 neon-text-normal"
                        style={{minHeight: '1.5rem', maxHeight: '5rem'}}
                    >
                        {isSubmitting ? "Now updating..." : "Update"}
                    </button>
                </div>
        </form>
);
};

export default MyUpdate;
