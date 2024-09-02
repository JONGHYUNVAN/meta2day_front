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
    const rotateSpeed = -10;
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                let response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recommendations/${recommendationType}?limit=6`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                let data = response.data.data.map((post: Post) => ({
                    ...post,
                    thumbnailURL: `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${post.thumbnailURL}`,
                }));

                if (data.length === 0) {
                    response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/?limit=6`);
                    data = response.data.data.map((post: Post) => ({
                        ...post,
                        thumbnailURL: `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${post.thumbnailURL}`,
                    }));
                }

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
        <div className="left-1/2 h-[100vh] flex items-center justify-center bg-transparent -mt-[20vh] z-30" draggable="false" >
            <div id="home-drag-container" className="relative w-[100vw] h-[60vh]" draggable="false">
                <div id="home-ceiling"
                     className="absolute top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] " draggable="false">
                    <Image
                        src={`/homeCeiling.webp`}
                        alt={``}
                        width={2000}
                        height={2000}
                        className="w-full h-full object-cover rounded-full hober:none electric-ceiling"
                        draggable="false"
                    />
                </div>
                <div id="home-spin-container" className="relative w-[20vw] h-[20vh]" draggable="false">
                    {posts.map(post => (
                        <Image
                            key={post.id}
                            src={post.thumbnailURL}
                            alt={post.title}
                            width={400}
                            height={800}
                            onClick={() => handleImageClick(post.id)}
                            className="cursor-pointer w-[30vh] h-[40vh] hover:w-[33vh] z-50 hover:h-[42vh] electric-img hover:mt-[-2vh]"
                            draggable="false"
                        />
                    ))}
                    <p className="text-white absolute top-full left-1/2 transform -translate-x-1/2 neon-text-normal">
                        Recommend by {recommendationType.replace('_', ' ')}s
                    </p>
                </div>
                <div id="home-ground"
                     className="absolute top-[110%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]" draggable="false">
                    <Image
                        src={`/homeFloor.webp`}
                        alt={``}
                        width={2000}
                        height={2000}
                        className="w-full h-full object-cover rounded-full hober:none electric-ground"
                        draggable="false"
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
