import React from 'react';
import Image from "next/image";
import { PostData } from './fetchPostData';
import YouTubeEmbed from './youtube'
import parse from 'html-react-parser';
import CommentForm from './commentForm';

interface ViewPostFormProps {
    data: PostData;
    id:string;
}

const ViewPostForm: React.FC<ViewPostFormProps> = ({ data,id }, ) => {
    const {
        title = '',
        youtubeURL = '',
        backGroundImgURL = '',
        thumbnailURL = '',
        content = '',
        createdAt,
        updatedAt,
        category,
        backGroundColor
    } = data;

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
    const embedUrl = youtubeURL ? `https://www.youtube.com/embed/${youtubeURL}?autoplay=1&mute=1` : null;

    return (
        <div className="mt-8 p-4 bg-transparent text-white shadow-md rounded-md relative">
            <h2 className="mt-10 mb-6 text-7xl font-bold text-center z-20 relative Do-Hyeon">{title}</h2>

            <div className="relative mb-4 w-auto h-[80vh]" style={{
                backgroundImage: `url(${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${backGroundImgURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                {embedUrl && youtubeURL && (
                    <div className="mb-4 flex justify-center w-full">
                        <div className="mt-[10vh] w-fullz-50 justify-items-center">
                            <YouTubeEmbed videoId={youtubeURL} />
                        </div>
                    </div>
                )}
            </div>
            <div className="text-sm text-gray-500 text-center">{`생성: ${createdAt}`}</div>
            <div className="text-sm text-gray-500 text-center">{`최종 수정: ${updatedAt}`}</div>
            <div className="text-center text-gray-500">카테고리: {category.name}</div>
            <div className="relative z-10 p-4 text-white mx-auto my-40 max-w-screen-xl"
                 style={{minHeight: '50vh', marginTop: '4rem', height: 'auto', backgroundColor: backGroundColor}}>
                {sanitizedContent}
                {thumbnailURL && (
                    <div className="mt-20 flex  bg-gray-800 bg-opacity-50 p-4 rounded"
                         style={{fontSize: '1.5rem'}}>
                        <Image
                            className="max-w-xs rounded-lg shadow-lg ml-40 mr-16"
                            src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${thumbnailURL}`}
                            alt="Thumbnail"
                            layout="responsive"
                            width={350}
                            height={450}
                        />
                    </div>
                )}
            </div>
            <CommentForm postId={parseInt(id)} />
        </div>
    );
};

export default ViewPostForm;
