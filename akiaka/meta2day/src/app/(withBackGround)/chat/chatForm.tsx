"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from '@/socket';
import useAuth from '@/hooks/useAuth';
import axios from 'axios';
import Image from 'next/image';
import { Button } from 'antd';
import { SendOutlined, SettingOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";
import useRefreshToken from "@/hooks/useRefreshToken";
import CreateRoomModal from "@/app/(withBackGround)/chat/createRoom";

interface ChatMessage {
    text: string;
    from: string;
    time: string;
    characterId: number;
    room: string;
    team: 'red' | 'blue';
}

export default function ChatForm() {
    const [isConnected, setIsConnected] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [redTeam, setRedTeam] = useState<string[]>([]);
    const [blueTeam, setBlueTeam] = useState<string[]>([]);
    const [redTeamTopic, setRedTeamTopic] = useState<string | null>(null);  // Red 팀 주제
    const [blueTeamTopic, setBlueTeamTopic] = useState<string | null>(null);  // Blue 팀 주제
    const [roomName, setRoomName] = useState<string | null>('waiting');
    const [userTeam, setUserTeam] = useState<'red' | 'blue' | null>(null);
    const { isLoggedIn, user } = useAuth();
    const [userInfo, setUserInfo] = useState<{ nickname: string; characterId: number; role: string } | null>(null);
    const router = useRouter();
    const refresh = useRefreshToken();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


    useEffect(() => {
        const fetchUserCharacter = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/character`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                const { nickname, characterId, role } = response.data;
                setUserInfo({ nickname, characterId, role });

                if (roomName) {
                    socket.emit('joinRoom', { room: roomName, nickname });
                } else {
                    console.error('No room name provided');
                }
            } catch (error: any) {
                if (error.response?.status === 401) {
                    await refresh();
                    await Swal.fire({
                        title: 'Token Refreshed',
                        text: '토큰이 갱신되었습니다. 새로고침합니다.',
                        icon: 'info',
                        confirmButtonText: '확인',
                    });
                    router.refresh();
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
            if (userInfo?.nickname && roomName) {
                socket.emit('leaveRoom', { room: roomName, nickname: userInfo.nickname });
            }
        };
    }, [isLoggedIn, isConnected, roomName]);

    const handleUpdateRoomInfo = (roomName: string, redTeamTopic: string, blueTeamTopic: string) => {
        socket.emit('updateRoomInfo', { roomName, redTeamTopic, blueTeamTopic, admin: true }, (response: any) => {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Room Updated!',
                    text: 'The room information has been successfully updated!',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message,
                });
            }
        });
    };

    const handleCreateRoomClick = () => {
        if (userInfo?.role !== 'admin') {
            Swal.fire({
                title: 'Unauthorized',
                text: 'Only admins can update the room.',
                icon: 'error',
                confirmButtonText: '확인',
            });
            return;
        }
        setIsModalVisible(true);
    };

    useEffect(() => {
        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);
        const handleMessage = (message: ChatMessage) => setMessages((prev) => [...prev, message]);
        const handleTeamUpdate = (teams: { redTeam: string[], blueTeam: string[] }) => {
            setRedTeam(teams.redTeam);
            setBlueTeam(teams.blueTeam);
        };

        const handleRoomInfoUpdated = (data: { roomName: string; redTeamTopic: string; blueTeamTopic: string }) => {
            setRoomName(data.roomName);
            setRedTeamTopic(data.redTeamTopic);
            setBlueTeamTopic(data.blueTeamTopic);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("message", handleMessage);
        socket.on("updateTeamMembers", handleTeamUpdate);
        socket.on("roomInfoUpdated", handleRoomInfoUpdated);  // 방 정보 업데이트 시 처리

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("message", handleMessage);
            socket.off("updateTeamMembers", handleTeamUpdate);
            socket.off("roomInfoUpdated", handleRoomInfoUpdated);
        };
    }, [isLoggedIn]);

    const sendMessage = (message: string) => {
        if (!isLoggedIn || !userTeam) {
            Swal.fire({
                title: 'Team Selection Required',
                text: '팀을 선택한 후에 메시지를 전송할 수 있습니다.',
                icon: 'warning',
                confirmButtonText: '확인',
                timer: 1000
            });
        }

        else if (!roomName) {
            Swal.fire({
                title: 'Room Not Found',
                text: '참여 중인 방이 없습니다. 방을 생성하거나 참가하세요.',
                icon: 'error',
                confirmButtonText: '확인',
                timer: 1000
            });
        }

        else if (userInfo?.nickname) {
            const formattedMessage: ChatMessage = {
                text: message,
                from: userInfo.nickname,
                time: new Date().toLocaleTimeString(),
                characterId: userInfo.characterId,
                room: roomName,
                team: userTeam,
            };
            socket.emit("message", formattedMessage);
        }

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };


    const handleTeamChange = (team: 'red' | 'blue') => {
        if (!userInfo?.nickname) {
            Swal.fire({
                title: 'Error',
                text: 'Please login first.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        setUserTeam(team);
        socket.emit('joinTeam', { team, nickname: userInfo.nickname }, (response: any) => {
            if (response.success) {
                setRoomName(response.roomName);
                setRedTeamTopic(response.redTeamTopic);
                setBlueTeamTopic(response.blueTeamTopic);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to join the team.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        });
    };


    return (
        <div>
        <div className="z-50 mt-[10vh] flex w-[80vw] max-w-[1200px] h-auto bg-transparent p-4">
            <div className="flex-grow shadow-lg mt-[1vh] min-h-[20vh] max-h-[65vh] overflow-y-auto cursor-pointer flex flex-col opacity-80 hover:opacity-95 transition-opacity duration-200"
                 onClick={() => handleTeamChange('red')}
            >
                <div className="bg-red-800 rounded-t-lg p-4 flex-shrink-0">
                    <h2 className="text-white font-semibold text-center">Red Team</h2>
                    <p className="text-white text-center">{redTeamTopic || "No Topic"}</p>  {/* Red 팀 주제 */}
                </div>

                <div className="bg-red-600 flex-grow p-4 overflow-y-auto rounded-b-lg">
                    {redTeam.length > 0 ? redTeam.map((member, index) => (
                        <p key={index} className="text-white text-center">{member}</p>
                    )) : <p className="text-red-900 text-center">No Members</p>}
                </div>
            </div>

            <div className="flex flex-col w-4/6 max-w-[800px] h-auto bg-transparent p-4 opacity-80 hover:opacity-95 transition-opacity duration-200">
                <div className="flex justify-between items-center p-4 rounded-t-lg shadow-lg bg-[#393939]">
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
                            <h2 className="text-white font-semibold" translate="no">
                                {userInfo?.nickname || 'User'} chats
                            </h2>
                            <p className="text-white text-sm">{messages.length} Messages</p>
                        </div>
                    </div>
                    <div className="text-white">
                        {roomName ? <p className="font-bold">{roomName}</p> : null}  {/* 방 이름 표시 */}
                    </div>
                    <div className="text-white">
                        {isConnected ? 'Online' : 'Offline'}
                    </div>
                </div>

                <div className="flex-grow p-4 bg-[#494949] shadow-inner min-h-[20vh] max-h-[55vh] overflow-y-auto opacity-80 hover:opacity-95 transition-opacity duration-200">
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-4">
                            {msg.from === 'System' ? (
                                <div className="w-full text-center">
                                    <p className="text-gray-400 bg-gray-700 p-2 rounded-lg inline-block">
                                        {msg.text}
                                    </p>
                                    <br/>
                                    <span className="text-xs text-gray-500">{msg.time}</span>
                                </div>
                            ) : (
                                <div
                                    className={`flex ${msg.team === 'red' ? 'justify-start' : 'justify-end'}`}>
                                    <div
                                        className={`flex items-center rounded-lg p-2 shadow-md ${
                                            msg.team === 'red' ? 'bg-red-400' : 'bg-blue-300'
                                        } ${msg.from === userInfo?.nickname ? 'border-2 border-gray-600' : ''}`}
                                    >
                                        {msg.from !== userInfo?.nickname && (
                                            <div className="flex flex-col items-center mr-2">
                                                <Image
                                                    src={`/character${msg.characterId}.webp`}
                                                    alt="User avatar"
                                                    className="w-8 h-8 rounded-full"
                                                    width={32}
                                                    height={32}
                                                />
                                                <span className="text-xs text-gray-100">{msg.from}</span>
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <p>{msg.text}</p>
                                            <span className="text-xs text-gray-600">{msg.time}</span>
                                        </div>
                                        {msg.from === userInfo?.nickname && (
                                            <div className="flex flex-col items-center ml-2">
                                                <Image
                                                    src={`/character${msg.characterId}.webp`}
                                                    alt="User avatar"
                                                    className="w-8 h-8 rounded-full"
                                                    width={32}
                                                    height={32}
                                                />
                                                <span className="text-xs text-gray-100">{msg.from}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center p-4 bg-[#393939] rounded-b-lg shadow-lg">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-grow border rounded-lg p-2 bg-[#797979]"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                            }
                        }}
                    />
                    <Button
                        icon={<SendOutlined/>}
                        className="rounded-lg ml-2 p-2"
                        style={{backgroundColor: '#6c757d', borderColor: '#6c757d', color: 'white'}}
                        onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            sendMessage(input.value);
                            input.value = '';
                        }}
                    />
                </div>
            </div>

            <div className="flex-grow shadow-lg mt-[1vh] min-h-[20vh] max-h-[65vh] overflow-y-auto cursor-pointer flex flex-col opacity-80 hover:opacity-95 transition-opacity duration-200"
                 onClick={() => handleTeamChange('blue')}>
                <div className="bg-blue-800 rounded-t-lg p-4 flex-shrink-0">
                    <h2 className="text-white font-semibold text-center">Blue Team</h2>
                    <p className="text-white text-center">{blueTeamTopic || "No Topic"}</p>  {/* Blue 팀 주제 */}
                </div>
                <div className="bg-blue-600 flex-grow p-4 overflow-y-auto rounded-b-lg">
                    {blueTeam.length > 0 ? blueTeam.map((member, index) => (
                        <p key={index} className="text-white text-center">{member}</p>
                    )) : <p className="text-white text-center">No Members</p>}
                </div>
            </div>
        </div>
    <CreateRoomModal
        isVisible={isModalVisible}
        onSubmit={handleUpdateRoomInfo}
        onCancel={() => setIsModalVisible(false)}
    />

    {userInfo?.role === 'admin' && (
        <div className="w-full flex justify-evenly mt-4">
            <Button
                type="primary"
                icon={<SettingOutlined />}
                style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}
                onClick={handleCreateRoomClick}
            >
                Update Room Info
            </Button>
        </div>
    )}
    </div>
    );
}