import React from "react";
import ClientSideReduxProvider from "@/components/ClientSideReduxProvider";
import Navbar from "@/components/Navbar";
import SSE from "@/components/SSE";

const CommonLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ClientSideReduxProvider>
            <Navbar />
            <SSE />
            {children}
        </ClientSideReduxProvider>
    );
};

export default CommonLayout;