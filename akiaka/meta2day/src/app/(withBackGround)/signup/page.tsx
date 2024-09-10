import SignupForm from './signupForm';

export const metadata = {
    title: 'Signup Page',
    description: 'Create a new account on our platform quickly and easily.',
    keywords: ['signup', 'register', 'create account', 'new user'],
};

const SignupPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <SignupForm />
        </div>
    );
};

export default SignupPage;
