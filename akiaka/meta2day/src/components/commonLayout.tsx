import React from "react";
import ClientSideReduxProvider from "@/components/ClientSideReduxProvider";
import Navbar from "@/components/Navbar";
import SSE from "@/components/SSE";
import useAuth from "@/hooks/useAuth";

const CommonLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ClientSideReduxProvider>
            <Navbar />
            {children}
        </ClientSideReduxProvider>
    );
};

export default CommonLayout;