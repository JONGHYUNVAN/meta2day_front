import CommonLayout from "@/components/commonLayout";

const FullLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html>
            <body>
                <div className="curtain-container z-10">
                    <div className="curtain top-curtain z-10"></div>
                    <div className="curtain bottom-curtain z-10"></div>
                </div>
                <div className="absolute left-[20vw] w-[60vw] h-[100vh]">
                    <video
                        className=" w-[60vw] h-[100vh] object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="/back_poster.webp "
                    >
                        <source src="/back_820.webm" type="video/webm" media="(min-width: 768px)"/>
                        <source src="/back_220.webm" type="video/webm" media="(max-width: 767px)"/>
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="hidden lg:block bg-transparent">

                    <div className="absolute w-[25vw] h-[100vh] overflow-hidden">
                        <video
                            className=" w-[60vw] h-[100vh] object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/side.webm" type="video/webm"/>
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div className="absolute right-0 w-[25vw] h-[100vh] overflow-hidden">
                        <video
                            className="w-[60vw] h-[100vh] object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/side.webm" type="video/webm"/>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>

                    <div>
                        <CommonLayout>
                            {children}
                        </CommonLayout>
                    </div>
            </body>
        </html>
);
};

export default FullLayout;