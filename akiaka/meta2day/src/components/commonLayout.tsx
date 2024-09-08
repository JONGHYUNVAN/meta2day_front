import React from "react";
import ClientSideReduxProvider from "@/components/ClientSideReduxProvider";
import Navbar from "@/components/Navbar";

const CommonLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ClientSideReduxProvider>
            {children}
        </ClientSideReduxProvider>
    );
};

export default CommonLayout;