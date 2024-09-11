'use client';

import React from "react";
import useAuth from "@/hooks/useAuth";

interface HomeButtonsProps {
    recommendationType: 'daily_view' | 'mbti' | 'age_group' | 'interest';
    setRecommendationType: React.Dispatch<React.SetStateAction<'daily_view' | 'mbti' | 'age_group' | 'interest'>>;
}

const HomeButtons: React.FC<HomeButtonsProps> = ({ recommendationType, setRecommendationType }) => {
    const { isLoggedIn } = useAuth();

    const handleButtonClick = (type: 'mbti' | 'age_group' | 'interest' | 'daily_view') => {
        setRecommendationType(type);
    };

    return (
        <div className="z-50">
            <button
                onClick={() => handleButtonClick('daily_view')}
                className={`px-4 py-2 mx-2 transition-opacity duration-300 ${recommendationType === 'daily_view' ? 'neon-text-normal' : 'neon-text'} ${!isLoggedIn ? 'z-[-1] opacity-0' : 'z-10 opacity-100'}`}
                disabled={!isLoggedIn}
            >
                Daily Views
            </button>
            <button
                onClick={() => handleButtonClick('mbti')}
                className={`px-4 py-2 mx-2 transition-opacity duration-300 ${recommendationType === 'mbti' ? 'neon-text-normal' : 'neon-text'} ${!isLoggedIn ? 'z-[-1] opacity-0' : 'z-10 opacity-100'}`}
                disabled={!isLoggedIn}
            >
                MBTIs
            </button>
            <button
                onClick={() => handleButtonClick('age_group')}
                className={`px-4 py-2 mx-2 transition-opacity duration-300 ${recommendationType === 'age_group' ? 'neon-text-normal' : 'neon-text'} ${!isLoggedIn ? 'z-[-1] opacity-0' : 'z-10 opacity-100'}`}
                disabled={!isLoggedIn}
            >
                Age Group
            </button>
            <button
                onClick={() => handleButtonClick('interest')}
                className={`px-4 py-2 mx-2 transition-opacity duration-300 ${recommendationType === 'interest' ? 'neon-text-normal' : 'neon-text'} ${!isLoggedIn ? 'z-[-1] opacity-0' : 'z-10 opacity-100'}`}
                disabled={!isLoggedIn}
                translate="no"
            >
                Interest
            </button>
        </div>
    );
}

export default HomeButtons;
