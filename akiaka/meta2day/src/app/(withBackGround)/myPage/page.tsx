'use client'
import React, { useState } from 'react';
import MyStats from "@/app/(withBackGround)/myPage/myStats";
import MyInfo from "@/app/(withBackGround)/myPage/myInfo";
import MyComments from "@/app/(withBackGround)/myPage/myComments";
import MyUpdate from "@/app/(withBackGround)/myPage/MyUpdate";

const MyPage: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'stats' | 'info' | 'comments' | 'update'>('stats');

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent ">
            <div className="relative max-w-6xl w-full font-serif opacity-80 hover:opacity-90 transition-opacity duration-200 shadow-md rounded-lg">

                <div className="metalic-bar absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-t-lg shadow-metallic">
                    <div className="absolute top-2 left-3 flex space-x-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full neon-effect-red"></span>
                        <span className="w-3 h-3 bg-yellow-500 rounded-full neon-effect-yellow"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full neon-effect-green"></span>
                    </div>
                </div>

                <div className="content-container h-fit overflow-scroll mt-12 bg-[#191919] p-4 rounded-b-lg animate-unfold">
                    <div className="flex">
                        <div className="w-80">
                            <button
                                className={`block w-60 mx-auto mt-5 mb-5 p-3 text-white rounded-full text-center outline-none transition-all duration-200 ${selectedTab === 'info' ? 'bg-transparent neon-text-normal border-2 border-[#3498db]' : 'bg-[#212121]'}`}
                                onClick={() => setSelectedTab('info')}
                            >
                                My Info
                            </button>
                            <button
                                className={`block w-60 mx-auto mt-5 mb-5 p-3 text-white rounded-full text-center outline-none transition-all duration-200 ${selectedTab === 'stats' ? 'bg-transparent neon-text-normal border-2 border-[#3498db]' : 'bg-[#212121]'}`}
                                onClick={() => setSelectedTab('stats')}
                            >
                                My Stats
                            </button>
                            <button
                                className={`block w-60 mx-auto mt-5 mb-5 p-3 text-white rounded-full text-center outline-none transition-all duration-200 ${selectedTab === 'comments' ? 'bg-transparent neon-text-normal border-2 border-[#3498db]' : 'bg-[#212121]'}`}
                                onClick={() => setSelectedTab('comments')}
                            >
                                My Comments
                            </button>
                            <button
                                className={`mt-[10vh] block w-60 mx-auto mb-5 p-3 text-white rounded-full text-center outline-none transition-all duration-200 ${selectedTab === 'update' ? 'bg-transparent neon-text-normal border-2 border-[#3498db]' : 'bg-[#212121]'}`}
                                onClick={() => setSelectedTab('update')}
                            >
                                My Update
                            </button>
                        </div>
                        <div className="w-full ">
                            {selectedTab === 'stats' && <MyStats/>}
                            {selectedTab === 'info' && <MyInfo/>}
                            {selectedTab === 'comments' && <MyComments/>}
                            {selectedTab === 'update' &&  <MyUpdate/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
