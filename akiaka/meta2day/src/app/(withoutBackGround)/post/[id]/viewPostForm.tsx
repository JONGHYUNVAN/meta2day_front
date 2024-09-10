'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import { PostData } from './fetchPostData';
import YouTubeEmbed from './youtube';
import parse from 'html-react-parser';
import CommentForm from './commentForm';
import MovieApiData from "@/app/(withoutBackGround)/post/[id]/apis/movieApiData";
import MusicApiData from "@/app/(withoutBackGround)/post/[id]/apis/musicApiData";
import BookApiData from "@/app/(withoutBackGround)/post/[id]/apis/bookApiData";

interface ViewPostFormProps {
    data: PostData;
    id: string;
}

const ViewPostForm: React.FC<ViewPostFormProps> = ({ data, id }) => {
    const {
        title = '',
        youtubeURL = '',
        backGroundImgURL = '',
        thumbnailURL = '',
        content = '',
        createdAt,
        updatedAt,
        category,
        backGroundColor,
        comments
    } = data;

    const contentRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 1,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            if (!isListening) return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target instanceof HTMLImageElement) {
                        if (entry.boundingClientRect.top < 100) return;
                        setIsListening(false);
                        entry.target.classList.add('fade-in-up');
                        window.scrollBy({
                            top: entry.boundingClientRect.top - 100,
                            behavior: 'smooth'
                        });
                        setTimeout(() => setIsListening(true), 1000);
                    } else {
                        entry.target.classList.add('fade-in-up');
                    }
                } else {
                    entry.target.classList.remove('fade-in-up');
                }
            });
        };

        observerRef.current = new IntersectionObserver(observerCallback, observerOptions);

        if (contentRef.current) {
            const elements = contentRef.current.querySelectorAll('p, img, h3');
            elements.forEach(el => observerRef.current?.observe(el));
        }

        const handleWheel = (event: WheelEvent) => {
            const scrollDirectionDown = event.deltaY > 0;

            if (scrollDirectionDown) {
                setIsListening(true);
            } else {
                setIsListening(false);
            }

            setLastScrollY(window.scrollY);
        };

        window.addEventListener('wheel', handleWheel);

        return () => {
            if (observerRef.current && contentRef.current) {
                const elements = contentRef.current.querySelectorAll('p, img, h3');
                elements.forEach(el => observerRef.current?.unobserve(el));
            }
            window.removeEventListener('wheel', handleWheel);
        };
    }, [isListening]);

    const addCloudFrontUrl = (html: string = ''): string => {
        return html.replace(/src="([^"]*)"/g, (match, p1) => {
            if (p1 && !p1.startsWith('http')) {
                return `src="${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${p1}"`;
            }
            return match;
        });
    };

    const updatedContent = addCloudFrontUrl(content);
    const sanitizedContent = parse(updatedContent);

    const renderApiComponentByCategory = () => {
        switch (data.category.id) {
            case 1:
                return <MovieApiData movieTitle={data.title.toString()} />;
            case 2:
                return <MusicApiData albumTitle={data.title.split(' - ')[0]} artistName={data.title.split(' - ')[1]} />;
            case 3:
                return <BookApiData bookTitle={data.title.split(' - ')[0]} authorName={data.title.split(' - ')[1]} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-4 bg-transparent text-white shadow-md rounded-md relative">
            <h2 className="mt-[10vh] mb-6 text-7xl font-bold text-center z-20 relative Do-Hyeon">{title}</h2>
            <div className="relative mb-4 w-auto h-[80vh]" style={{
                backgroundImage: `url(${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${backGroundImgURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                {youtubeURL && (
                    <div className="mb-4 flex justify-center w-full">
                        <div className="mt-[10vh] w-full z-50 justify-items-center">
                            <YouTubeEmbed videoId={new URL(youtubeURL).searchParams.get('v')} />
                        </div>
                    </div>
                )}
            </div>
            <div className="text-sm text-gray-500 text-center">{`생성: ${createdAt}`}</div>
            <div className="text-sm text-gray-500 text-center">{`최종 수정: ${updatedAt}`}</div>
            <div className="text-center text-gray-500">카테고리: {category.name}</div>
            <div ref={contentRef} className="relative z-10 p-4 text-white mx-auto my-40 max-w-screen-xl special-animation-container"
                 style={{minHeight: '50vh', marginTop: '4rem', height: 'auto', backgroundColor: backGroundColor}}>
                {sanitizedContent}
                {thumbnailURL && (
                    <div className="flex bg-gray-800 bg-opacity-50 p-4 rounded"
                         style={{fontSize: '1.5rem'}}>
                        <Image
                            className="max-w-xs rounded-lg shadow-lg ml-40 mr-16"
                            src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${thumbnailURL}`}
                            alt="Thumbnail"
                            width={350}
                            height={450}
                        />
                        {renderApiComponentByCategory()}
                    </div>
                )}
            </div>
            <CommentForm postId={parseInt(id)} comments={comments} />
        </div>
    );
};

export default ViewPostForm;
