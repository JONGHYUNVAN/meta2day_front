'use client';

import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Image from 'next/image';
import LineChart from "@/components/chart/LineChart";
import { useRouter } from 'next/navigation';

export interface Post {
    id: number;
    title: string;
    preview: string;
    createdAt: string;
    thumbnailURL: string;
    views: number;
    averageRating: number;
    joyScore: number;
    angerScore: number;
    irritationScore: number;
    fearScore: number;
    sadnessScore: number;
    updatedAt: string;
}

const PostForm: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(3);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [field, setField] = useState<string | null>(null);
    const [order, setOrder] = useState<string>('ASC');
    const cardRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const updateLimit = () => {
            const windowHeight = window.outerHeight;
            console.log('Height:', windowHeight);

            if (windowHeight <= 1300) {
                setLimit(2);
            } else {
                setLimit(3);
            }
        };

        updateLimit();

        return () => window.removeEventListener('resize', updateLimit);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params: any = {
                    page,
                    limit,
                };
                if (field) {
                    params.field = field;
                    params.order = order;
                }

                const response = await axios.get('http://localhost:3001/api/posts/', { params });

                const updatedPosts = response.data.data.map((post: any) => ({
                    ...post,
                    thumbnailURL: `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${post.thumbnailURL}`,
                }));

                setPosts(updatedPosts);
                setTotalPages(Math.ceil(response.data.total / limit));
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, [page, limit, field]);

    const handleClick = () => {
        const colors = [0xDAA520, 0x800000];
        const color2 = getRandomColorInRange(colors);
        const color1 = adjustColor(color2, 0.3);
        const color3 = adjustColor(color2, 1.5);

        if (cardRef.current) {
            cardRef.current.style.setProperty('--gradient-color1', color1);
            cardRef.current.style.setProperty('--gradient-color2', color2);
            cardRef.current.style.setProperty('--gradient-color3', color3);
        }
    };
    const getRandomColorInRange = (colors: number[]) => {
        const color1 = colors[0];
        const color2 = colors[1];

        const randomColor = Math.floor(Math.random() * (color2 - color1 + 1)) + color1;
        return `#${randomColor.toString(16).padStart(6, '0')}`;
    };

    function adjustColor(color:string, factor: number) {
        const r = Math.min(255, Math.max(0, parseInt(color.substring(1, 3), 16) * factor));
        const g = Math.min(255, Math.max(0, parseInt(color.substring(3, 5), 16) * factor));
        const b = Math.min(255, Math.max(0, parseInt(color.substring(5, 7), 16) * factor));
        return `rgba(${r}, ${g}, ${b}, 1)`;
    }


    const handleSort = (field: string | null, order: string = 'ASC') => {
        setField(field);
        setOrder(order);
        setPage(1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0 ? '✫' : '';
        const emptyStars = '☆'.repeat(5 - fullStars - (halfStar ? 1 : 0));
        return '★'.repeat(fullStars) + halfStar + emptyStars;
    };

    const getButtonClassName = (buttonField: string | null) => {
        return buttonField === field
            ? 'text-white neon-text-normal'
            : 'text-white neon-text-normal opacity-50 hover:opacity-90';
    };

    if (loading) return <div className="text-gray-400 text-4xl">Now loading...wait a second!</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="card"
             style={{marginTop: 'clamp(50px, 1%, 1%)'}}
             ref={cardRef}
             onClick={handleClick}
        >
            <div className="h-auto p-4 bg-transparent overflow-auto">
                <div className="flex justify-end mb-4 space-x-4 mr-10">
                    <button
                        onClick={() => handleSort(null)}
                        className={getButtonClassName(null)}
                    >
                        기본순
                    </button>
                    <button
                        onClick={() => handleSort('views', 'DESC')}
                        className={getButtonClassName('views')}
                    >
                        조회순
                    </button>
                    <button
                        onClick={() => handleSort('averageRating', 'DESC')}
                        className={getButtonClassName('averageRating')}
                    >
                        평점순
                    </button>
                </div>
                <div className={`${ limit === 2 ? 'space-y-24 mt-[7vh]' : ''  }`}>
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-transparent h-auto shadow-md rounded-xl overflow-auto mb-6 flex border-8 border-gray-300 border-t-[#2A2B2F] border-l-[#2A2B2F] border-b-[#141517] border-r-[#141517] opacity-80 hover:opacity-100 transition-opacity duration-200"
                            onClick={() => router.push(`/post/${post.id}`)}
                        >
                            <div className="flex-1 p-4 w-3/4">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-orange-400 ml-5 font-sans">{post.title}</h3>
                                    <span className="text-yellow-300 text-sm mr-10">{post.views} views</span>
                                </div>

                                <p className="text-gray-300 mb-2 white-space-pre-line"
                                   style={{fontSize: 'clamp(1rem, 1.3vh, 2.5rem)'}}>{post.preview}</p>

                                <div className="flex justify-between items-center text-sky-500 text-sm mb-2 ml-10 mr-10">
                                    <span>{post.createdAt.substring(0, 20)}</span>
                                    <span className="neon-text-normal text-2xl">{renderStars(post.averageRating)}</span>
                                    <span>{post.updatedAt.substring(0, 20)}</span>
                                </div>

                                <LineChart
                                    data={[
                                        {
                                            emotion: 'Scores',
                                            Joy: post.joyScore || 0.1,
                                            Anger: post.angerScore || 0.1,
                                            Irritation: post.irritationScore || 0.1,
                                            Fear: post.fearScore || 0.1,
                                            Sadness: post.sadnessScore || 0.1,
                                        },
                                    ]}
                                />
                            </div>
                            <div>
                                <Image
                                    src={post.thumbnailURL}
                                    alt={post.title}
                                    width={200}
                                    height={400}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="absolute bottom-5 left-1/2 transform neon-text-normal -translate-x-1/2">
                        <div className="flex justify-between items-center space-x-4">
                            <button
                                onClick={handlePreviousPage}
                                disabled={page === 1}
                                className="text-white text-5xl neon-text-normal disabled:opacity-10"
                            >
                                &lt;
                            </button>
                            <span className="text-white">Page {page} / {totalPages}</span>
                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className="text-white text-5xl neon-text-normal disabled:opacity-10"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostForm;
