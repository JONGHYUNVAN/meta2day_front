'use client';
import React, {useState, useRef, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';
import FileUpload from "../../../../components/editor/FileUpload/FileUpload";
import { handleDescriptionImages} from "../../../../components/editor/FileUpload/handleImages";
import 'react-quill/dist/quill.snow.css';

const Editor = dynamic(() => import('../../../../components/editor/editor'), { ssr: false });

const CreateMovie = () => {
    const [title, setTitle] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [bigImgUrl, setBigImgUrl] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const thumbnailRef = useRef(null);
    const bigImgRef = useRef(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            router.push('/login');
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const uploadedThumbnailUrl = await thumbnailRef.current.uploadFileToS3();
        const uploadedBigImgUrl = await bigImgRef.current.uploadFileToS3();

        if (!uploadedThumbnailUrl || !uploadedBigImgUrl) {
            alert('Failed to upload images');
            return;
        }

        const updatedDescription = await handleDescriptionImages(description, title);

        const movieData = {
            title,
            description: updatedDescription,
            youtubeUrl,
            bigImgUrl: `${uploadedBigImgUrl}`,
            thumbNailUrl: `${uploadedThumbnailUrl}`,
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movies`, movieData, {
                headers: {
                    Authorization: `${localStorage.getItem('accessToken')}`
                }
            });
            alert('Movie updated successfully!');
            const movieId = response.data.id;
            window.location.href = `/movie/${movieId}`;
        } catch (error) {
            console.error('Error updating movie:', error);
        }
    };

    const extractYouTubeID = (url) => {
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
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Thumbnail</label>
                    <FileUpload setFileUrl={setThumbnailUrl} ref={thumbnailRef} />
                    {thumbnailUrl && (
                        <div
                            className="w-52 bg-cover bg-center mt-4"
                            style={{ backgroundImage: `url(${thumbnailUrl})`, height: '20vh' }}
                        />
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="bigImg" className="block text-sm font-medium text-gray-700">Big Image</label>
                    <FileUpload setFileUrl={setBigImgUrl} ref={bigImgRef} />
                    {bigImgUrl && (
                        <div
                            className="bg-cover bg-center mb-4"
                            style={{ backgroundImage: `url(${bigImgUrl})`, height: '30vh' }}
                        />
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <Editor value={description} onChange={setDescription} />
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

export default CreateMovie;
