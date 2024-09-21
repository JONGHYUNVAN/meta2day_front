'use client';

import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Image from 'next/image';
import LineChart from "@/components/chart/LineChart";
import { useRouter } from 'next/navigation';
import { SearchOutlined } from '@ant-design/icons';

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
    const [limit, setLimit] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [field, setField] = useState<string | null>(null);
    const [order, setOrder] = useState<string>('DESC');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [title, setTitle] = useState<string | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
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
            window.addEventListener('resize', updateLimit);
            return () => window.removeEventListener('resize', updateLimit);
        }
    }, []);

    useEffect(() => {
        if(limit===0) return;
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
                if(title) params.title = title;

                let response;
                if (title) response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/search`, { params });
                else response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/`, { params });

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
    }, [page, limit, field, order, title]);

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

    const handleSearch = (title: string | null) => {
        setTitle(title);
        setPage(1);
    };

    const handleSort = (field: string | null, order: string = 'DESC') => {
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
        <div className="card mt-[20vh]"
             style={{marginTop: 'clamp(50px, 1%, 1%)'}}
             ref={cardRef}
             onClick={handleClick}
        >
            <div className="h-auto p-2 bg-transparent overflow-auto text-sm">
                <div className="relative flex items-center justify-center opacity-70 hover:opacity-95">
                    <form
                        name="search"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch(searchTerm);
                        }}
                        className="relative"
                    >
                        <input
                            type="text"
                            className="input w-12 h-12 bg-transparent border-4 rounded-full neon-text-hover border-x-amber-200 border-y-amber-50 text-xl text-center outline-none transition-all hover:w-[25vw] hover:bg-gray-700 hover:rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <SearchOutlined className="absolute top-1/2 right-6 transform translate-x-1/2 -translate-y-1/2 text-amber-100 text-3xl transition-all duration-300 ease-in-out hover:opacity-0 pointer-events-none"/>
                    </form>
                </div>

                <div className="flex justify-end mb-[2vh] space-x-4 mr-10">
                    <button
                        onClick={() => handleSort('createdAt', 'DESC')}
                        className={getButtonClassName('createdAt')}
                    >
                        Latest
                    </button>
                    <button
                        onClick={() => handleSort('views', 'DESC')}
                        className={getButtonClassName('views')}
                    >
                        Views
                    </button>
                    <button
                        onClick={() => handleSort('averageRating', 'DESC')}
                        className={getButtonClassName('averageRating')}
                    >
                        Ratings
                    </button>
                </div>
                <div className={`${limit === 2 ? 'space-y-[5vh] mt-[2vh]' : 'space-y-[1vh] mt-[0.5vh]'}`}>
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className={`bg-transparent overflow-hidden shadow-md rounded-xl mb-[1vh] flex border-8 border-gray-300 border-t-[#2A2B2F] border-l-[#2A2B2F] border-b-[#141517] border-r-[#141517] opacity-80 hover:opacity-100 transition-opacity duration-200 ${
                                limit === 2 ? 'h-[33vh]' : 'h-[23vh]'
                            }`}
                            onClick={() => router.push(`/post/${post.id}`)}
                        >
                            <div className={`flex-1 p-2 ${limit === 2 ? 'w-3/4 mt-[2vh]' : 'w-3/5 mt-[1vh]'}`}>
                                <div className="flex justify-between items-center mb-[1vh]">
                                    <h3 className={`text-orange-400 font-sans ${limit === 2 ? 'ml-5 text-xl' : 'ml-3 text-lg'}`}>
                                        {post.title}
                                    </h3>
                                    <span
                                        className={`text-yellow-300 ${limit === 2 ? 'text-sm mr-10' : 'text-xs mr-5'}`}>
                        {post.views} views
                    </span>
                                </div>

                                <p className={`text-gray-300 mb-[1vh] white-space-pre-line overflow-hidden ${limit === 2 ? 'text-l' : 'text-xl'}`}>
                                    {post.preview} ...
                                </p>

                                <div
                                    className={`flex justify-between items-center text-sky-500 ${limit === 2 ? 'text-sm' : 'text-xs'} mb-[0.5vh] ml-${limit === 2 ? '10' : '5'} mr-${limit === 2 ? '10' : '5'}`}>
                                    <span>{post.createdAt.substring(0, 20)}</span>
                                    <span
                                        className="neon-text-normal text-2xl">{renderStars(post.averageRating)}</span>
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
                            <div
                                className={`w-auto top-1/2 ${limit === 2 ? 'h-fit max-h-[30vh]' : 'h-fit max-h-[23vh]'}`}>
                                <Image
                                    src={post.thumbnailURL}
                                    alt={post.title}
                                    width={200}
                                    height={400}
                                    className={`w-auto top-1/2 ${limit === 2 ? 'h-[29vh] max-h-[30vh] min-h-60' : 'h-[22vh] max-h-[23vh] min-h-40'} overflow-hidden`}
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
