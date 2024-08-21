'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCarouselEffect } from '@/hooks/useCarouselEffect';

interface Post {
    id: number;
    title: string;
    thumbnailURL: string;
    views: number;
}

interface HomePageProps {
    recommendationType: 'mbti' | 'age_group' | 'interest' | 'daily_view';
}

const HomePage: React.FC<HomePageProps> = ({ recommendationType }) => {
    const radius = (typeof window !== 'undefined' ? window.innerWidth/4 : 400) || 400;
    const rotateSpeed = -50;
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recommendations/${recommendationType}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                const data = response.data.data.map((post: Post) => ({
                    ...post,
                    thumbnailURL: `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${post.thumbnailURL}`,
                }));
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            }
        };

        fetchPosts();
    }, [recommendationType]);

    useCarouselEffect(radius, rotateSpeed, posts);

    const handleImageClick = (id: number) => {
        router.push(`/post/${id}`);
    };

    return (
        <div className="left-1/2 h-[100vh] flex items-center justify-center bg-black -mt-[15vh]" >
            <div id="home-drag-container" className="relative w-full h-[20vh]">
                <div id="home-spin-container" className="relative w-[20vw] h-[20vh]">
                    {posts.map(post => (
                        <Image
                            key={post.id}
                            src={post.thumbnailURL}
                            alt={post.title}
                            width={400}
                            height={800}
                            onClick={() => handleImageClick(post.id)}
                            className="cursor-pointer w-[30vh] h-[40vh] hover:image-flicker"
                        />
                    ))}
                    <p className="text-white absolute top-full left-1/2 transform -translate-x-1/2 neon-text-normal">
                        Recommended by {recommendationType.replace('_', ' ')}
                    </p>
                </div>
                <div id="home-ground" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]"></div>
            </div>
        </div>
    );
};

export default HomePage;
