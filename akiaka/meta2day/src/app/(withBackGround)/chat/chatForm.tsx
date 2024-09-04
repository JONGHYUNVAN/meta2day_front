"use client";

import { useEffect, useState } from "react";
import { socket } from '@/socket';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import useAuth from '@/hooks/useAuth';
import axios from 'axios';
import Image from 'next/image';
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import {useRouter} from "next/navigation";

interface ChatMessage {
    text: string;
    from: string;
    time: string;
    characterId: number;
    room: string;
}

export default function ChatForm() {
    const [isConnected, setIsConnected] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const { isLoggedIn, user } = useAuth();
    const [userInfo, setUserInfo] = useState<{ nickname: string; characterId: number } | null>(null);
    const router = useRouter();
    useAuthRedirect();

    useEffect(() => {
        const fetchUserCharacter = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/character`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                const { nickname, characterId } = response.data;
                setUserInfo({ nickname, characterId });

                // 방에 참가 시 닉네임을 함께 전송
                socket.emit('joinRoom', { room: 'room1', nickname: nickname });
            } catch (error: any) {
                if (error.response?.status === 401) {
                    await Swal.fire({
                        title: 'Token Expired',
                        text: '토큰이 만료되었습니다. 다시 로그인해주세요.',
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

        if (isLoggedIn) {
            fetchUserCharacter();
        }

        return () => {
            socket.emit('leaveRoom', { room: 'room1', nickname: userInfo?.nickname });
        };
    }, [isLoggedIn,isConnected]);


    useEffect(() => {
        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);
        const handleMessage = (message: ChatMessage) => setMessages((prev) => [...prev, message]);

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("message", handleMessage);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("message", handleMessage);
        };
    }, [isLoggedIn]);

    const sendMessage = (message: string) => {
        if (!isLoggedIn) {
            Swal.fire({
                title: 'Login Required',
                text: '로그인이 필요합니다. 로그인 페이지로 이동합니다.',
                icon: 'warning',
                confirmButtonText: '확인',
            }).then(() => {
                router.push('/login');
            });
            return;
        }
        if (userInfo?.nickname) {
            const formattedMessage: ChatMessage = {
                text: message,
                from: userInfo.nickname,
                time: new Date().toLocaleTimeString(),
                characterId: userInfo.characterId,
                room: 'room1',
            };
            socket.emit("message", formattedMessage);
        }
    };

    return (
        <div className="z-50 mt-[10vh] flex flex-col w-[60vw] max-w-[800px] h-auto bg-transparent p-4 opacity-80 hover:opacity-95 transition-opacity duration-200">
            <div className="flex justify-between items-center p-4 rounded-t-lg shadow-lg bg-[#393939] ">
                <div className="flex items-center bg-transparent">
                    {userInfo && (
                        <Image
                            src={`/character${userInfo.characterId}.webp`}
                            alt="User avatar"
                            className="w-12 h-12 rounded-full"
                            width={48}
                            height={48}
                        />
                    )}
                    <div className="ml-4">
                        <h2 className="text-white font-semibold">{userInfo?.nickname || 'User'} says</h2>
                        <p className="text-white text-sm">{messages.length} Messages</p>
                    </div>
                </div>
                <div className="text-white">
                    {isConnected ? 'Online' : 'Offline'}
                </div>
            </div>

            <div className="flex-grow p-4 bg-[#494949] shadow-inner min-h-[20vh] max-h-[65vh] overflow-y-scroll">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-4 ${msg.from === userInfo?.nickname ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg p-2 shadow-md ${msg.from === userInfo?.nickname ? 'bg-red-400 text-black' : 'bg-blue-300'}`}>
                            <p>{msg.text}</p>
                            <span className="text-xs text-gray-600">{msg.time}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center p-4 bg-[#393939] rounded-b-lg shadow-lg">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-grow border rounded-lg p-2 bg-[#797979]"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = "";
                        }
                    }}
                />
                <Button
                    icon={<SendOutlined />}
                    className="rounded-lg ml-2 p-2"
                    style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: 'white' }}
                    onClick={() => {
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        sendMessage(input.value);
                        input.value = '';
                    }}
                >
                </Button>
            </div>
        </div>
    );
}