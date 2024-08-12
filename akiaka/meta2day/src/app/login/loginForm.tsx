'use client';

import React, { useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {login} from "@/store/slices/authSlice";
import {useDispatch} from "react-redux";



const LoginForm: React.FC = () => {
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();


    const validatePassword = (password: string) => {
        if (password.length < 8) {
            return '비밀번호는 최소 8자 이상이어야 합니다.';
        }
        if (password.length > 20) {
            return '비밀번호는 최대 20자 이하이어야 합니다.';
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return '비밀번호에는 최소 하나의 소문자가 포함되어야 합니다.';
        }
        if (!/(?=.*[0-9])/.test(password)) {
            return '비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.';
        }
        if (!/(?=.*[!@#$%^&*])/.test(password)) {
            return '비밀번호에는 최소 하나의 특수 문자가 포함되어야 합니다.';
        }
        return null;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isSubmitting) return;

        const form = event.target as HTMLFormElement;
        const password = form.password.value;
        const email = form.useremail.value;

        const error = validatePassword(password);
        if (error) {
            setPasswordError(error);
            return;
        }

        setPasswordError(null);
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
                    email,
                    password,
                },
            );

            if (response.status === 200) {
                const accessToken = response.headers['authorization'];
                localStorage.setItem('token', accessToken);
                dispatch(login());

                if (typeof router.back === 'function') {
                    router.back();
                } else {
                    router.push('/');
                }

            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                setPasswordError('Login failed: ' + error.message);
            } else {
                setPasswordError('An unknown error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent">
            <div className="w-[400px] p-10 bg-[#191919] text-center opacity-80 hover:opacity-95 transition-opacity duration-200 rounded-xl">
                <h1 className="mt-5 text-white uppercase font-bold text-3xl neon-text">Welcome !</h1>
                <form className="mt-10" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="useremail"
                        placeholder="User Email"
                        className="block w-3/5 mx-auto mt-5 mb-5 p-3 border-2 border-[#3498db] text-white bg-transparent rounded-full text-center outline-none transition-all duration-200 focus:w-[300px] focus:border-[#2ecc71]"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="block w-3/5 mx-auto mt-5 mb-5 p-3 border-2 border-[#3498db] text-white bg-transparent rounded-full text-center outline-none transition-all duration-200 focus:w-[300px] focus:border-[#2ecc71]"
                    />

                    {passwordError && (
                        <p className="text-red-500 text-xl Nanum-Pen-Script mb-4 neon-text-red">{passwordError}</p>
                    )}

                    <div className="flex mt-10 items-center justify-center my-5">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <Link href="/signup" className="px-4 text-gray-300 link-underline">Need new account?</Link>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <input
                        type="submit"
                        value="Login"
                        className="w-3/5 mx-auto p-3 mt-5 mb-3 border-2 border-[#2ecc71] text-white bg-transparent rounded-full cursor-pointer transition duration-300 hover:bg-[#2ecc71]"
                    />
                </form>
                <ul className="flex justify-center mt-6 space-x-14">
                    <li>
                        <a href="#" className="flex items-center justify-center w-12 h-12 text-2xl text-white transition-transform duration-200 rounded-full social-icon icoKakao">
                            <Image src="/kakao.webp" alt="Kakao" width={32} height={32} className="rounded-full" />
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center justify-center w-12 h-12 text-2xl text-white transition-transform duration-200 rounded-full social-icon icoGoogle">
                            <Image src="/google.webp" alt="Google" width={30} height={30} className="rounded-full" />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default LoginForm;
