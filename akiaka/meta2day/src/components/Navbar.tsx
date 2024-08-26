'use client';
import Link from 'next/link';
import Image from 'next/image';
import useAuth from '../hooks/useAuth';
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store/store";
import {login, logout} from "@/store/slices/authSlice";
import {useEffect, useState} from "react";

const Navbar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoggedIn, user, isAdmin, handleLogout } = useAuth();

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(login());
        } else {
            dispatch(logout());
        }
    }, [dispatch]);

    return (
        <nav className="fixed top-1 w-full h-[8vh] bg-gray-200 shadow-md z-50 text-xl metallic-navbar opacity-80 hover:opacity-90 transition-opacity duration-100">
            <ul className="flex top-1/2 justify-between items-center text-black font-handwriting">
                <li className="absolute top-[5vh] left-1/2 opacity-80 transform -translate-x-1/2 -translate-y-1/2 z-50 neon-image">
                    <Link href="/home">
                        <Image src="/logo.webp" alt="logo" width={100} height={100}
                               className="opacity-90 hover:opacity-100 transition-opacity duration-300"/>
                    </Link>
                </li>

                <li className="ml-[10vw] top-1/2 neon-text relative">
                    <Link href="/post" className="opacity-70 hover:opacity-100 transition-opacity duration-300">
                        POSTS
                    </Link>
                    {isAdmin && (
                        <div className="relative inline-block ml-[10vw]">
                            <button
                                onClick={toggleDropdown}
                                className="opacity-70 hover:opacity-100 transition-opacity duration-300 neon-text"
                            >
                                Admin
                            </button>
                            <ul
                                className={`absolute -right-20 w-52 bg-transparent border border-gray-600 shadow-lg transition-transform duration-300 ${
                                    isDropdownOpen ? 'transform translate-y-[2.5vh] opacity-100 visible' : 'transform translate-y-0 opacity-0 invisible'
                                }`}
                            >
                                <li className="p-2 text-center rounded-none metallic-navbar-dropdown">
                                    <Link href="/post/new" className="link-underline">NEW POST</Link>
                                </li>
                                <li className="p-2  text-center rounded-none metallic-navbar-dropdown">
                                    <Link href="/settings" className="link-underline">Settings</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </li>

                <div className="flex items-center space-x-[10vw] mr-[10vw] neon-text">
                    {isLoggedIn ? (
                        <>
                            <Link href="/myPage"
                                  className="opacity-70 hover:opacity-100 transition-opacity duration-300">
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
