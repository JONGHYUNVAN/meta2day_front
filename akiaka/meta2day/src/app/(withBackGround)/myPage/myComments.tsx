'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from "next/link";
import LineChart from "@/components/chart/LineChart";
import {useAuthRedirect} from "@/hooks/useAuthRedirect";

interface Comment {
    id: number;
    user: {
        id: number;
        nickname: string;
    };
    post: {
        id: number;
        title: string;
        views: number;
    };
    rating: number;
    comment: string;
    joyScore: number;
    angerScore: number;
    irritationScore: number;
    shynessScore: number;
    sadnessScore: number;
    createdAt: string;
    updatedAt: string;
}

const MyComments: React.FC = () => {
    useAuthRedirect();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(2);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get<{ data: Comment[], total: number }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/my`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                    params: {
                        page,
                        limit,
                    },
                });
                setComments(response.data.data);
                setTotalPages(Math.ceil(response.data.total / limit));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching comments:', error);
                setLoading(false);
            }
        };

        fetchComments();
    }, [page, limit]);

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0 ? '*' : '';
        const emptyStars = '☆'.repeat(5 - fullStars - (halfStar ? 1 : 0));
        return '★'.repeat(fullStars) + halfStar + emptyStars;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="p-8 bg-[#191919] min-h-[30vh] h-auto overflow-auto rounded-lg shadow-md flex items-center justify-center">
            <div className="text-white text-lg Nanum-Pen-Script w-full">
                {comments.map(comment => (
                    <div key={comment.id} className="text-white text-lg Nanum-Pen-Script w-full flex flex-col items-center mb-8">
                        <div className="w-full flex justify-between text-xs text-gray-400 mb-1">
                            <span className="neon-text-normal text-xl">{comment.createdAt}</span>
                            <span className="neon-text-normal text-xl">{comment.updatedAt}</span>
                        </div>
                        <div className="w-full flex justify-between items-center mb-4">
                            <span className="neon-text text-2xl">{renderStars(comment.rating)}</span>
                            <span className="w-full mr-[3vw] text-center neon-text-normal"
                                  style={{fontSize: 'clamp(2rem, 2vh, 4rem)'}}>
                                “{comment.comment}”
                            </span>
                        </div>
                        <div className="w-full text-right">
                        <Link href={`/post/${comment.post.id}`} className="neon-text-normal mt-1 link-underline">- at “ {comment.post.title} ” -</Link>
                        </div>
                        <LineChart
                            data={[{
                                emotion: 'Scores',
                                Joy: comment.joyScore || 0.1,
                                Anger: comment.angerScore || 0.1,
                                Irritation: comment.irritationScore || 0.1,
                                Shyness: comment.shynessScore || 0.1,
                                Sadness: comment.sadnessScore || 0.1,
                            }]}
                        />
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className="text-white disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-white">Page {page} of {totalPages}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className="text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyComments;