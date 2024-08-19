'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import FileUploader, {FileUploadRef} from "@/components/fileUploader/fileUploader";
import {useAuthRedirect} from "@/hooks/useAuthRedirect";
import TextEditor from "@/components/contentEditor/textEditor";

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [backGroundImgUrl, setBackGroundImgUrl] = useState('');
    const [content, setContent] = useState(' ');
    const thumbnailRef = useRef<FileUploadRef | null>(null);
    const backGroundImgRef = useRef<FileUploadRef | null>(null);
    useAuthRedirect()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (thumbnailRef.current && backGroundImgRef.current) {
            const uploadedThumbnailUrl = await thumbnailRef.current.uploadFileToS3();
            const uploadedBackGroundImgUrl = await backGroundImgRef.current.uploadFileToS3();

            if (!uploadedThumbnailUrl || !uploadedBackGroundImgUrl) {
                alert('Failed to upload images');
                return;
            }

            const postData = {
                title,
                content,
                youtubeUrl,
                backGroundImgURL: uploadedBackGroundImgUrl,
                thumbnailURL: uploadedThumbnailUrl,
                categoryId: '1'
            };

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`, postData, {
                    headers: {
                        Authorization: `${localStorage.getItem('accessToken')}`
                    }
                });
                alert('Post created successfully!');
                const postId = response.data.id;
                window.location.href = `/post/${postId}`;
            } catch (error) {
                console.error('Error creating post:', error);
            }
        } else {
            alert('Thumbnail or background image upload failed.');
        }
    };
    const extractYouTubeID = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeID = extractYouTubeID(youtubeUrl);

    return (
        <div className="container mx-auto my-40 max-w-screen-xl">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700">YouTube URL</label>
                    <input
                        type="text"
                        id="youtubeUrl"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                    />
                    {youtubeID && (
                        <div className="flex justify-center mt-4">
                            <iframe
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${youtubeID}`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}
                </div>

                <div className="mb-4 text-white">
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Thumbnail</label>
                    <FileUploader setFileUrl={setThumbnailUrl} ref={thumbnailRef} />
                </div>

                <div className="mb-4 text-white">
                    <label htmlFor="bigImg" className="block text-sm font-medium text-gray-700">Background Image</label>
                    <FileUploader setFileUrl={setBackGroundImgUrl} ref={backGroundImgRef} />
                </div>

                <div className="mb-4">
                    <label htmlFor="content">Content</label>
                    <TextEditor value={content} onChange={setContent}/>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreatePost;