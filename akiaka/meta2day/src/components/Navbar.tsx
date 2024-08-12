'use client';
import Link from 'next/link';
import Image from 'next/image';
import useAuth from '../hooks/useAuth';

const Navbar: React.FC = () => {
    const { isLoggedIn, user, handleLogout } = useAuth();

    return (
        <nav className="fixed top-1 w-full bg-gray-200 shadow-md z-50 opacity-80 metallic-navbar">
            <ul className="flex justify-between items-center py-4 text-black font-handwriting">
                <li className="absolute top-10 left-1/2 opacity-80 transform -translate-x-1/2 -translate-y-1/2 z-50 neon-image">
                    <Link href="/">
                        <Image src="/logo.webp" alt="logo" width={100} height={100}
                               className="opacity-90 hover:opacity-100 transition-opacity duration-300"/>
                    </Link>
                </li>

                <li className="ml-40 neon-text">
                    <Link href="/post" className="opacity-40 hover:opacity-100 transition-opacity duration-300">
                        POSTS
                    </Link>
                </li>

                <div className="flex items-center space-x-20 mr-40">
                    {isLoggedIn ? (
                        <>
                            <li className="opacity-40 hover:opacity-100 transition-opacity duration-300 neon-text">
                                {user?.nickname} 님, 반갑습니다!
                            </li>
                            <li>
                                <button onClick={handleLogout}
                                        className="opacity-40 hover:opacity-100 transition-opacity duration-300 neon-text">
                                    LOGOUT
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="neon-text">
                                <Link href="/signup"
                                      className="opacity-40 hover:opacity-100 transition-opacity duration-300">
                                    SIGN UP
                                </Link>
                            </li>
                            <li className="neon-text">
                                <Link href="/login"
                                      className="opacity-40 hover:opacity-100 transition-opacity duration-300">
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
