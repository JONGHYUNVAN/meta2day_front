import CommonLayout from "@/components/commonLayout";
import Navbar from "@/components/Navbar";
import BackgroundVideo from "./backgroundVideo";
import React from "react";

const FullLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html>
        <body>
        <div>
            <CommonLayout>
                <Navbar />
                <BackgroundVideo />
                {children}
            </CommonLayout>
        </div>

        <div className="curtain-container z-10">
            <div className="curtain top-curtain z-10"></div>
            <div className="curtain bottom-curtain z-10"></div>
        </div>
        </body>
        </html>
    );
};

export default FullLayout;