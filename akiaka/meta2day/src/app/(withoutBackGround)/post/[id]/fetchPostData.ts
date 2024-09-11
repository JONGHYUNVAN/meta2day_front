import axios from 'axios';

interface User {
    id: number;
    nickname: string;
}

interface Category {
    id: number;
    name: string;
    description: string;
}
interface Comment {
    id: number;
    rating: number;
    comment: string;
    user:User
    createdAt: string;
    updatedAt: string;
    joyScore: number;
    angerScore: number;
    irritationScore: number;
    fearScore: number;
    sadnessScore: number;
}

export interface PostData {
    id: number;
    title: string;
    preview: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    thumbnailURL: string;
    backGroundImgURL: string;
    youtubeURL?: string | null;
    views: number;
    averageRating: number;
    comments: Comment[];
    category: Category;
    interests: any[];
    joyScore?: number;
    angerScore?: number;
    irritationScore?: number;
    fearScore?: number;
    sadnessScore?: number;
    backGroundColor: string;
    user: User;
}

const fetchPostData = async (id: string): Promise<PostData | null> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts/${id}`);
        const post: PostData = response.data;

        return post;
    } catch (error) {
        console.error('Error fetching post data:', error);
        return null;
    }
};

export default fetchPostData;