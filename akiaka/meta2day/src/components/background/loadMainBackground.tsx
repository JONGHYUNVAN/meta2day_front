import React from "react";

const BackgroundVideos: React.FC = () => {
    return (
        <>
            <div className="absolute left-[25vw] w-[50vw] h-[100vh]">
                <video
                    className=" w-[50vw] h-[100vh] object-cover"
                    autoPlay
                    muted
                    playsInline
                    poster="/back_poster.webp "
                >
                    <source src="/bg_movie.webm" type="video/webm" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="hidden lg:block bg-transparent">
                <div className="absolute w-[40vw] h-[100vh] overflow-hidden animate-reveal-left">
                    <video
                        className=" w-[40vw] h-[100vh] object-cover"
                        autoPlay
                        muted
                        playsInline
                    >
                        <source src="/bg_music.webm" type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="absolute right-0 w-[40vw] h-[100vh] overflow-hidden animate-reveal-right">
                    <video
                        className="w-[40vw] h-[100vh] object-cover"
                        autoPlay
                        muted
                        playsInline
                    >
                        <source src="/bg_book.webm" type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </>
    );
};

export default BackgroundVideos;
