import LoginForm from "@/app/(withBackGround)/login/loginForm";

export const metadata = {
    title: 'Meta2day: login',
    description: 'Log in to your account to access exclusive content, manage your profile, and more. Secure and easy login process.',
    keywords: ['login', 'account access', 'user login', 'secure login'],
};

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <LoginForm />
        </div>
    );
};

export default LoginPage;
