import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import CommonLayout from "@/components/commonLayout";
import Sse from "@/components/SSE";

export const metadata: Metadata = {
    title: "Meta2day",
    icons: {
        icon: "/favicon.ico",
    },
};

const RootLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
        <body>
        <CommonLayout>
            {children}
            <Sse/>
        </CommonLayout>
        </body>
        </html>
    );
};

export default RootLayout;
