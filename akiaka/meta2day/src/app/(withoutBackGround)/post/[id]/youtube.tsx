'use client'
import React, { useEffect, useState, useRef } from 'react';
import YouTube from 'react-youtube';

interface YouTubeEmbedProps {
    videoId: string;
    height?: string;
    width?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, height = '50vh', width = '90vh' }) => {
    const [dimensions, setDimensions] = useState({
        width: `${parseFloat(height) * 0.01 * window.innerHeight * (16 / 9)}px`,
        height: `${parseFloat(height) * 0.01 * window.innerHeight}px`,
    });
    const [isVideoVisible, setIsVideoVisible] = useState(false);
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: `${parseFloat(height) * 0.01 * window.innerHeight * (16 / 9)}px`,
                height: `${parseFloat(height) * 0.01 * window.innerHeight}px`,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [height]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setIsVideoVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    const opts = {
        height: dimensions.height,
        width: dimensions.width,
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
        },
    };

    return (
        <div ref={videoRef} style={{ width: dimensions.width, height: dimensions.height }}>
            {isVideoVisible ? <YouTube videoId={videoId} opts={opts} /> : null}
        </div>
    );
};

export default YouTubeEmbed;