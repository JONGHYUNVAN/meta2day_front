import CommonLayout from "@/components/commonLayout";
import Navbar from "@/components/Navbar";
import React from "react";

const NoBackgroundLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html>
            <body>
                <div>
                    <CommonLayout>
                        <Navbar />
                        {children}
                    </CommonLayout>
                </div>
            </body>
        </html>
    );
};

export default NoBackgroundLayout;