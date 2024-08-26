'use client';

import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import LineChart from "@/components/chart/LineChart";

interface Comment {
    id: number;
    rating: number;
    comment: string;
    user:User
    createdAt: string;
    updatedAt: string;
    joyScore: number;
    angerScore: number;
    irritationScore: number;
    fearScore: number;
    sadnessScore: number;
}
interface User {
    id:number;
    nickname:string;

}
interface CommentFormProps {
    postId: number;
    comments: Comment[];
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, comments }) => {
    const [comment, setComment] = useState<string>('');
    const [rating, setRating] = useState<number>(0);

    const handleRating = (rate: number) => {
        setRating(rate);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('token');
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments`, {
                postId,
                rating,
                comment,
            }, {
                headers: {
                    Authorization: `${accessToken}`,
                },
            });
            setComment('');
            setRating(0);
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                alert('이미 평가한 이벤트입니다');
            } else {
                console.error('Error creating comment:', error);
                alert('Failed to create comment.');
            }
        }
    };
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0 ? '*' : '';
        const emptyStars = '☆'.repeat(5 - fullStars - (halfStar ? 1 : 0));
        return '★'.repeat(fullStars) + halfStar + emptyStars;
    };

    return (
        <div
            className="w-full max-w-screen-xl mx-auto mt-8 p-4 bg-opacity-50 text-white shadow-md rounded-md">
            <form onSubmit={handleSubmit}
                  className="mt-8 p-4 bg-gray-800   bg-opacity-50 text-white shadow-md rounded-md">
                <h2 className="text-2xl font-semibold mb-4 neon-text-normal">One Line Review</h2>
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-300">I Say</label>
                    <input
                        id="comment"
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="neon-text-normal text-center w-full h-auto bg-transparent text-white border border-gray-600 text-2xl Nanum-Pen-Script shadow-sm focus:ring focus:ring-opacity-50"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">I Rate</label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`cursor-pointer text-2xl ${rating >= star ? 'neon-text' : 'text-gray-400'}`}
                                onClick={() => handleRating(star)}
                            >
                    ★
                </span>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            </form>


            <div className="mt-8 bg-transparent">
                {comments.map(comment => (
                    <div key={comment.id}
                         className="text-white bg-gray-800 text-lg Nanum-Pen-Script w-full flex flex-col items-center mb-8 rounded mt-8">
                        <div className="w-full flex justify-between text-xs text-gray-400 mb-1">
                            <span className="neon-text-normal ml-5 text-xl">{comment.createdAt}</span>
                            <span className="neon-text-normal mr-5 text-xl">{comment.updatedAt}</span>
                        </div>
                        <div className="w-full flex justify-between items-center mb-4">
                            <span className="neon-text text-2xl ml-1">{renderStars(comment.rating)}</span>
                            <span className="w-full mr-[3vw] text-center neon-text-normal"
                                  style={{fontSize: 'clamp(2rem, 2vh, 4rem)'}}>
                                “{comment.comment}”
                            </span>
                        </div>
                        <LineChart
                            data={[{
                                emotion: 'Scores',
                                Joy: comment.joyScore || 0.1,
                                Anger: comment.angerScore || 0.1,
                                Irritation: comment.irritationScore || 0.1,
                                Fear: comment.fearScore || 0.1,
                                Sadness: comment.sadnessScore || 0.1,
                            }]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};


export default CommentForm;