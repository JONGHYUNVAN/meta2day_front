'use client';

import React, {useState} from 'react';
import HomePage from './homeForm';
import HomeButtons from "@/app/(withBackGround)/home/homeButtons";

const Home: React.FC = () => {
    const [recommendationType, setRecommendationType] = useState<'daily_view' | 'mbti' | 'age_group' | 'interest'>('daily_view');

    return (
        <div className="z-50 h-[100vh] flex flex-col items-center justify-center bg-transparent overflow-hidden" draggable="false">
            <div className="mt-[15vh]"></div>
            <HomeButtons
                recommendationType={recommendationType}
                setRecommendationType={setRecommendationType}
            />
            <HomePage recommendationType={recommendationType}/>
        </div>
    );
};

export default Home;
