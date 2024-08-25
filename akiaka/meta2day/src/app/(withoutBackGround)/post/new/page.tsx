'use client';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import FileUploader, { FileUploadRef } from "@/components/fileUploader/fileUploader";
import TextEditor from "@/components/contentEditor/textEditor";
import { Button, Tooltip } from 'antd';
import { UploadOutlined, BgColorsOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';
import { useAdminRedirect } from "@/hooks/useAdminRedirect";

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [youtubeURL, setYoutubeURL] = useState('');
    const [thumbnailURL, setThumbnailURL] = useState('');
    const [backGroundImgURL, setBackGroundImgURL] = useState('');
    const [content, setContent] = useState(' ');
    const [categoryId, setCategoryId] = useState('');
    const thumbnailRef = useRef<FileUploadRef | null>(null);
    const backGroundImgRef = useRef<FileUploadRef | null>(null);
    const [backGroundColor, setBackGroundColor] = useState('#1E1F22');
    const fontColors: string[] = [
        '#ffffff', // White
        '#f8f9fa', // Light Gray
        '#dcdcdc', // Gainsboro
        '#d3d3d3', // Light Gray 2
        '#c0c0c0', // Silver
        '#808080', // Gray
        '#1E1F22', // Default Dark Gray
        '#f5f5dc', // Beige
        '#fffacd', // Lemon Chiffon
        '#ffd700', // Gold
        '#ffcc99', // Light Orange
        '#ffcccc', // Light Red
        '#f4a460', // SandyBrown
        '#deb887', // BurlyWood
        '#d2b48c', // Tan
        '#8b4513', // SaddleBrown
        '#a52a2a', // Brown
        '#e6ffe6', // Light Green
        '#cceeff', // Light Cyan
        '#dbeeff', // Light Blue
        '#e6e6fa', // Lavender
    ];
    useAdminRedirect();

    const handleThumbnailUpload = async () => {
        if (thumbnailRef.current) {
            const uploadedUrl = await thumbnailRef.current.uploadFileToS3();
            if (uploadedUrl) {
                setThumbnailURL(uploadedUrl);
                alert(`썸네일 업로드 성공:${uploadedUrl}`);
            } else {
                alert('썸네일 업로드 실패');
            }
        }
    };

    const handleBackgroundImageUpload = async () => {
        if (backGroundImgRef.current) {
            const uploadedUrl = await backGroundImgRef.current.uploadFileToS3();
            if (uploadedUrl) {
                setBackGroundImgURL(uploadedUrl);
                alert(`배경이미지 업로드 성공${uploadedUrl}`);
            } else {
                alert('배경이미지 업로드 실패');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const postData = {
            title,
            content,
            youtubeURL,
            backGroundImgURL: backGroundImgURL,
            thumbnailURL: thumbnailURL,
            categoryId,
            backGroundColor
        };
        console.log(postData);

        if (!title || !content || !backGroundImgURL || !thumbnailURL || !categoryId || !backGroundColor) {
            alert('글이 완성되지 않았습니다. 비어있는 항목이 있습니다.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`, postData, {
                headers: {
                    Authorization: `${localStorage.getItem('token')}`
                }
            });
            alert('Post created successfully!');
            const postId = response.data.id;
            window.location.href = `/post/${postId}`;
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const extractYouTubeID = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeID = extractYouTubeID(youtubeURL);

    return (
        <div className="mt-0 mx-auto my-40 max-w-screen-xl">
            <form onSubmit={handleSubmit}>
                <div className="mb-4 text-white">
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        id="categoryId"
                        className="w-full text-black  mt-[10vh] text-center p-2 border rounded border-gray-300"
                    >
                        <option value="">카테고리를 선택하세요</option>
                        <option value="1">Movie</option>
                        <option value="2">Music</option>
                        <option value="3">Book</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-xl font-medium text-gray-400">제목</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="youtubeUrl" className="block text-xl font-medium text-gray-400">유튜브 URL</label>
                    <input
                        type="text"
                        id="youtubeUrl"
                        value={youtubeURL}
                        onChange={(e) => setYoutubeURL(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
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
                    <label htmlFor="thumbnail" className="block text-xl font-medium text-gray-400">썸네일 업로드</label>
                    <div className="file-upload-section bg-gray-400 flex items-center space-x-4">
                        <div className="flex-grow bg-white text-black">
                            <FileUploader ref={thumbnailRef} setFileUrl={setThumbnailURL}/>
                        </div>
                        <Button onClick={handleThumbnailUpload} icon={<UploadOutlined />}>
                            Upload Thumbnail
                        </Button>
                    </div>
                </div>

                <div className="mb-4 text-white">
                    <label htmlFor="bigImg" className="block text-xl font-medium text-gray-400">배경이미지 업로드</label>
                    <div className="file-upload-section bg-gray-400 flex items-center space-x-4">
                        <div className="flex-grow bg-white text-black">
                            <FileUploader ref={backGroundImgRef} setFileUrl={setBackGroundImgURL}/>
                        </div>
                        <Button onClick={handleBackgroundImageUpload} icon={<UploadOutlined />}>
                            Upload Background Image
                        </Button>
                    </div>
                </div>

                <label htmlFor="content" className="text-xl text-gray-400">배경색</label>
                <div className="mb-4">
                    <div className="flex space-x-2">
                        {fontColors.map((color) => (
                            <Tooltip title={`Background ${color}`} key={color}>
                                <Button
                                    icon={<BgColorsOutlined />}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setBackGroundColor(color)}
                                    type={backGroundColor === color ? 'primary' : 'default'}
                                />
                            </Tooltip>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="content" className="text-xl text-gray-400">도구</label>
                    <TextEditor value={content} onChange={setContent} />
                </div>
                <button
                    type="submit"
                    className="float-right px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Submit
                </button>
                <div className="mt-14"></div>
                <label htmlFor="content" className="text-xl text-gray-400">본문 미리보기</label>
                <div className="mt-10 mb-4 text-white">
                    <div className="mb-4" style={{backgroundColor: backGroundColor}}>
                        {parse(content)}
                    </div>
                </div>

            </form>
        </div>
    );
};

export default CreatePost;
