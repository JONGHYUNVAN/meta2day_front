import CommonLayout from "@/components/commonLayout";

const NoBackgroundLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html>
            <body>
                <div>
                    <CommonLayout>
                        {children}
                    </CommonLayout>
                </div>
            </body>
        </html>
    );
};

export default NoBackgroundLayout;