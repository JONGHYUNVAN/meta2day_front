'use client';
import Link from 'next/link';
import Image from 'next/image';
import useAuth from '../hooks/useAuth';
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store/store";
import {login, logout} from "@/store/slices/authSlice";
import {useEffect} from "react";

const Navbar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoggedIn, user, handleLogout } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(login());
        } else {
            dispatch(logout());
        }
    }, [dispatch]);
    const handleNotificationClick = () => {
        // 알림 클릭 시 실행할 동작 (예: 알림 팝업 열기)
        console.log("Notification button clicked!");
    };

    return (
        <nav className="fixed top-1 w-full bg-gray-200 shadow-md z-50 text-xl metallic-navbar opacity-80 hover:opacity-90 transition-opacity duration-100">
            <ul className="flex justify-between items-center py-4 text-black font-handwriting">
                <li className="absolute top-10 left-1/2 opacity-80 transform -translate-x-1/2 -translate-y-1/2 z-50 neon-image">
                    <Link href="/">
                        <Image src="/logo.webp" alt="logo" width={100} height={100}
                               className="opacity-90 hover:opacity-100 transition-opacity duration-300"/>
                    </Link>
                </li>
                <li className="absolute top-10 right-10 opacity-80 transform -translate-y-1/2 z-50 neon-image">
                    <Link href="/alarm">
                        <button 
                                className="opacity-70 hover:opacity-100 transition-opacity duration-300 neon-text">
                        <Image src="/alarm.png" alt="Notifications" width={24} height={24} />
                        {/* 예: 알림 배지 */}
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                        </button>
                    </Link>
                </li>
                <li className="ml-40 neon-text">
                    <Link href="/post" className="opacity-70 hover:opacity-100 transition-opacity duration-300">
                        POSTS
                    </Link>
                </li>

                <div className="flex items-center space-x-20 mr-40 neon-text">
                    {isLoggedIn ? (
                        <>
                            <Link href="/myPage" className="opacity-70 hover:opacity-100 transition-opacity duration-300">
                                Welcome, {user?.nickname} !
                            </Link>
                            <li>
                                <button onClick={handleLogout}
                                        className="opacity-70 hover:opacity-100 transition-opacity duration-300 neon-text">
                                    LOGOUT
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            
                            <li className="neon-text">
                                <Link href="/signup"
                                      className="opacity-70 hover:opacity-100 transition-opacity duration-300">
                                    SIGN UP
                                </Link>
                            </li>
                            <li className="neon-text">
                                <Link href="/login"
                                      className="opacity-70 hover:opacity-100 transition-opacity duration-300">
                                    LOGIN
                                </Link>
                            </li>
                        </>
                    )}
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
