import ChatForm from './chatForm';

export const metadata = {
    title: 'Meta2day: Chat',
    description: 'This is the chat page for real-time conversations',
    keywords: ['chat', 'real-time', 'conversation'],
};

const ChatPage: React.FC = () => {
    return (
        <div className="min-h-screen z-50 flex items-center justify-center bg-transparent">
            <ChatForm />
        </div>
    );
};

export default ChatPage;
