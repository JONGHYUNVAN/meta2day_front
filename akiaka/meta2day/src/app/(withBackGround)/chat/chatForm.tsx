"use client";

import { useEffect, useState } from "react";
import { socket } from '@/socket'

const ChatForm = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);
        const handleMessage = (message: string) => setMessages((prev) => [...prev, message]);

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("message", handleMessage);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("message", handleMessage);
        };
    }, []);

    const sendMessage = (message: string) => {
        socket.emit("message", message);
    };

    return (
        <div className="z-50">
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        sendMessage((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                    }
                }}
                placeholder="Type a message and press Enter"
            />
        </div>
    );
};

export default ChatForm;