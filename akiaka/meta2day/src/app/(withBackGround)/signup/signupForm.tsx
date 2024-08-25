'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';

interface IFormInput {
    name: string;
    nickname: string;
    email: string;
    password: string;
    gender: string;
    ageGroup: string;
    mbti: string[];
    characterId: string;
    voiceTypeId: string;
    categoryId: number;
}

const SignupForm: React.FC = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<IFormInput>({
        mode: 'onChange',
        defaultValues: {
            characterId: '',
        },
    });
    const [serverError, setServerError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const formattedData = {
                ...data,
                mbti: mbti.join(''),
                voiceTypeId: data.characterId
            };
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, formattedData);

            if (response.status === 201) {
                router.push('/login');
            } else {
                setServerError('Signup failed. Please try again.');
                console.error('Signup failed', response.statusText);
            }

        } catch (error) {
            setServerError('Failed to signup, please try again.');
            console.error('Failed to signup', error);
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
            const currentIndex = currentOptions.indexOf(mbti[index]);
            const newIndex = (currentIndex + 1) % currentOptions.length;
            const newMbti = [...mbti];
            newMbti[index] = currentOptions[newIndex];
            setValue('mbti', newMbti);
        }, 250);
        setTimeout(() => setActiveIndex(null), 300);
    };

    const handleCharacterClick = (id: string) => {
        setSelectedCharacter(id);
        setValue('characterId', id);
    };

    const handleCategoryClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(event.target.value, 10);
        if (!isNaN(selectedId)) {
            setSelectedCategory(selectedId);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}
              className="max-w-4xl w-1/2 mx-auto mt-28 p-8 bg-[#191919] text-white font-serif opacity-80 hover:opacity-90 transition-opacity duration-200 shadow-md rounded-lg">
            <h2 className="text-4xl font-handwriting font-bold text-center mb-6 neon-text">Sign Up</h2>
            {serverError && <p className="text-red-500 text-center">{serverError}</p>}

            <div className="grid grid-cols-2 text-xl gap-4 font-handwriting neon-text-normal">
                <div>
                    <label htmlFor="name" className="block text-2xl font-bold mb-2">
                        {errors.name ?
                            <span className="text-red-500 neon-text-red">{errors.name.message}</span> : 'Name'}
                    </label>
                    <input
                        {...register('name', {required: 'Name is required'})}
                        type="text"
                        id="name"
                        className={`w-full text-black p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                </div>

                <div>
                    <label htmlFor="nickname" className="block text-2xl font-bold mb-2">
                        {errors.nickname ?
                            <span className="text-red-500 neon-text-red">{errors.nickname.message}</span> : 'Nickname'}
                    </label>
                    <input
                        {...register('nickname', {required: 'Nickname is required'})}
                        type="text"
                        id="nickname"
                        className={`w-full text-black p-2 border rounded ${errors.nickname ? 'border-red-500' : 'border-gray-300'}`}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-2xl font-bold mb-2">
                        {errors.email ?
                            <span className="text-red-500 neon-text-red">{errors.email.message}</span> : 'Email'}
                    </label>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {value: /^\S+@\S+$/i, message: 'Invalid email address'}
                        })}
                        type="email"
                        id="email"
                        className={`w-full text-black p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-2xl font-bold mb-2">
                        {errors.password ? <span
                            className="text-red-500 neon-text-red Nanum-Pen-Script">{errors.password.message}</span> : 'Password'}
                    </label>
                    <input
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {value: 8, message: '비밀번호는 최소 8자 이상이어야 합니다.'},
                            maxLength: {value: 20, message: '비밀번호는 최대 20자 이하여야 합니다.'},
                            pattern: {
                                value: /(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                                message: '비밀번호에는 최소한 하나의 소문자, 하나의 숫자, 하나의 특수 문자가 포함되어야 합니다.'
                            }
                        })}
                        type="password"
                        id="password"
                        className={`w-full text-black p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                </div>

                <div>
                    <label htmlFor="gender" className="block text-2xl font-bold mb-2">
                        {errors.gender ?
                            <span className="text-red-500 neon-text-red">{errors.gender.message}</span> : 'Gender'}
                    </label>
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                {...register('gender', {required: 'Gender is required'})}
                                type="radio"
                                value="Male"
                                className="form-radio"
                            />
                            <span className="ml-2">Male</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                {...register('gender', {required: 'Gender is required'})}
                                type="radio"
                                value="Female"
                                className="form-radio"
                            />
                            <span className="ml-2">Female</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="ageGroup" className="block text-2xl font-bold mb-2">
                        {errors.ageGroup ?
                            <span className="text-red-500 neon-text-red">{errors.ageGroup.message}</span> : 'Age Group'}
                    </label>
                    <select
                        {...register('ageGroup', {required: 'Age Group is required'})}
                        id="ageGroup"
                        className={`w-full text-black text-center Nanum-Pen-Script p-2 border rounded ${errors.ageGroup ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">연령대를 선택하세요</option>
                        <option value="10">10대</option>
                        <option value="20">20대</option>
                        <option value="30">30대</option>
                        <option value="40">40대 이상</option>
                    </select>
                </div>

                <div className="col-span-1">
                    <label htmlFor="mbti" className="block text-2xl font-bold mb-2" translate="no"> MBTI </label>
                    <div className="flex space-x-2">
                        {mbti.map((char, index) => (
                            <div key={index} className="mbti-spin font-serif">
                                <div
                                    onClick={() => handleMbtiClick(index)}
                                    className={`mbti-spin-inner ${activeIndex === index ? 'mbti-spin-active' : ''} cursor-pointer w-12 text-center p-2 border rounded border-gray-300`}
                                    translate="no"
                                >
                                    {char}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-1">
                    <label htmlFor="categoryId" className="block text-2xl font-bold mb-2">
                        {errors.categoryId ?
                            <span
                                className="text-red-500 neon-text-red">{errors.categoryId.message}</span> : 'Favorite Category'}
                    </label>
                    <select
                        {...register('categoryId', {required: 'Favorite Category is required'})}
                        id="categoryId"
                        onChange={handleCategoryClick}
                        className={`w-full text-center text-xl Nanum-Pen-Script text-black min-h-96 border rounded ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                        style={{minHeight: '1rem', maxHeight: '1.75rem'}}
                        translate="no"
                    >
                        <option value="">좋아하는 항목을 선택하세요</option>
                        <option value="1">Movie</option>
                        <option value="2">Music</option>
                        <option value="3">Book</option>
                    </select>
                </div>

                <div className="col-span-2 flex justify-center">
                    <div>
                        <label
                            htmlFor="characterId"
                            className="block text-2xl font-bold mb-2 text-center"
                        >
                            {errors.characterId ?
                                <span
                                    className="text-red-500 neon-text-red">{errors.characterId.message}</span> : 'Character'}
                        </label>
                        <div className="flex space-x-4 justify-center">
                            {[1, 2, 3, 4, 5].map(id => (
                                <div
                                    key={id}
                                    onClick={() => handleCharacterClick(id.toString())}
                                    className={`cursor-pointer rounded-full transition-transform duration-200 ${selectedCharacter === id.toString() ? `transform scale-125 border-2 ${id === 1 ? 'border-yellow-500' : id === 2 ? 'border-red-500' : id === 3 ? 'border-green-500' : id === 4 ? 'border-blue-500' : 'border-purple-500'}` : 'border border-gray-300'}`}
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
                    <input type="hidden" {...register('characterId', {required: 'Character must be selected'})} />
                </div>

            </div>
            <button
                type="submit"
                className="w-full mx-auto p-3 mt-5 mb-3 border-2 border-teal-500 text-white bg-transparent rounded-full cursor-pointer transition duration-200 hover:bg-teal-500 hover:border-teal-500"
            >
                Sign Up
            </button>
        </form>
    );
};

export default SignupForm;
