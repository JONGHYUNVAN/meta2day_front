'use client';
import React, { useState, FormEvent } from 'react';
import axios from 'axios';

interface CommentFormProps {
    postId: number;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId}) => {
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

    return (
        <form onSubmit={handleSubmit} className="mt-8 p-4 bg-gray-800 bg-opacity-50 text-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-4">후기를 남겨주세요</h2>
            <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-300">코멘트</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-32 bg-transparent text-white border border-gray-500 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Rating</label>
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`cursor-pointer text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
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
    );
};

export default CommentForm;
