import CommonLayout from "@/components/commonLayout";

const FullLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html>
            <body>
                <video
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/back_poster.webp"
                >
                    <source src="/back_820.webm" type="video/webm" media="(min-width: 768px)"/>
                    <source src="/back_220.webm" type="video/webm" media="(max-width: 767px)"/>
                    Your browser does not support the video tag.
                </video>

                <div className="hidden lg:block">
                    <video
                        className="absolute opacity-90 top-0 left-0 h-full w-[25%] object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/side.webm" type="video/webm"/>
                        Your browser does not support the video tag.
                    </video>
                    <video
                        className="absolute opacity-90 top-0 right-0 h-full w-[25%] object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/side.webm" type="video/webm"/>
                        Your browser does not support the video tag.
                    </video>
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