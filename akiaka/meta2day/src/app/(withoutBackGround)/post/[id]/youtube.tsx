'use client';

import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

interface YouTubeEmbedProps {
    videoId: string | null;
    height?: string;
    width?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, height = '50vh', width = '90vh' }) => {
    const [dimensions, setDimensions] = useState({
        width: `${parseFloat(height) * 0.01 * window.innerHeight * (16 / 9)}px`,
        height: `${parseFloat(height) * 0.01 * window.innerHeight}px`,
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: `${parseFloat(height) * 0.01 * window.innerHeight * (16 / 9)}px`,
                height: `${parseFloat(height) * 0.01 * window.innerHeight}px`,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [height, width]);

    const opts = {
        height: dimensions.height,
        width: dimensions.width,
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
        },
    };

    return (
        <div style={{ width: dimensions.width, height: dimensions.height }}>
            <YouTube videoId={videoId} opts={opts} />
        </div>
    );
};

export default YouTubeEmbed;
