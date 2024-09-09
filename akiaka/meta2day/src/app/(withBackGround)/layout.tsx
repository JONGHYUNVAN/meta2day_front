"use client";
import CommonLayout from "@/components/commonLayout";
import Navbar from "@/components/Navbar";
import React, { useEffect, useRef } from "react";

const FullLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const bgMainContainerRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const leftVideoContainerRef = useRef<HTMLDivElement>(null);
    const rightVideoContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (videoContainerRef.current) {
                videoContainerRef.current.style.display = "none";
            }
            if (leftVideoContainerRef.current) {
                leftVideoContainerRef.current.style.display = "none";
            }
            if (rightVideoContainerRef.current) {
                rightVideoContainerRef.current.style.display = "none";
            }
            if (bgMainContainerRef.current) {
                bgMainContainerRef.current.style.transition = "left 1s ease-in-out";
                bgMainContainerRef.current.style.left = "0";
            }
        }, 14000);

        return () => clearTimeout(timer);
    }, []);

    const handleMainVideoEnd = () => {
        if (bgMainContainerRef.current) {
            bgMainContainerRef.current.style.display = "none";
        }
    };

    return (
        <html>
        <body>
        <div ref={videoContainerRef} className="absolute left-[25vw] w-[50vw] h-[100vh]">
            <video
                className="w-[50vw] h-[100vh] object-cover"
                autoPlay
                muted
                playsInline
                poster="/back_poster.webp"
            >
                <source src="/bg_movie.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>
        </div>

        <div ref={leftVideoContainerRef} className="hidden lg:block bg-transparent">
            <div className="absolute w-[40vw] h-[100vh] overflow-hidden animate-reveal-left">
                <video
                    className="w-[40vw] h-[100vh] object-cover"
                    autoPlay
                    muted
                    playsInline
                >
                    <source src="/bg_music.webm" type="video/webm" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>

        <div ref={rightVideoContainerRef} className="absolute right-0 w-[40vw] h-[100vh] overflow-hidden animate-reveal-right">
            <video
                className="w-[40vw] h-[100vh] object-cover"
                autoPlay
                muted
                playsInline
            >
                <source src="/bg_book.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>
        </div>

        <div
            ref={bgMainContainerRef}
            className="absolute left-[-100vw] w-[100vw] h-[100vh]"
        >
            <video
                className="w-[100vw] h-[100vh] object-cover"
                autoPlay
                muted
                playsInline
                onEnded={handleMainVideoEnd}
            >
                <source src="/bg_main.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>
        </div>

        <div>
            <CommonLayout>
                <Navbar />
                {children}
            </CommonLayout>
        </div>

        <div className="curtain-container z-10">
            <div className="curtain top-curtain z-10"></div>
            <div className="curtain bottom-curtain z-10"></div>
        </div>
        </body>
        </html>
    );
};

export default FullLayout;