import PostForm from "@/app/(withBackGround)/post/pageForm";

export const metadata = {
    title: 'Explore Posts | Engage with Content',
    description: 'Browse and explore posts featuring titles, previews, user ratings, and emotional scores. Discover insights from various posts, with real-time engagement data.',
    keywords: ['posts', 'content', 'ratings', 'views', 'emotions', 'engagement'],
};

export default function PostPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparen">
                <PostForm/>
        </div>
    );
}
