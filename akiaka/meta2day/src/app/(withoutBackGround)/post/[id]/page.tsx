import React from 'react';
import fetchPostData from "@/app/(withoutBackGround)/post/[id]/fetchPostData";
import ViewPostForm from "@/app/(withoutBackGround)/post/[id]/viewPostForm";

interface PostPageProps {
    params: { id: string };
}
export async function generateMetadata({ params }: PostPageProps) {
    const { id } = params;
    const data = await fetchPostData(id);

    if (!data) {
        return {
            title: 'Post not found',
            description: 'The post you are looking for could not be found.',
        };
    }

    return {
        title: data.title || 'View Post',
        description: data.preview || 'Read more about this post.',
        keywords: ['post', 'blog', data.title],
    };
}

const PostViewPage: React.FC<PostPageProps> = async ({ params }) => {
    const { id } = params;
    const data = await fetchPostData(id);

    if (!data) {
        return <div>Post not found</div>;
    }

    return (
        <div>
            <ViewPostForm data={data} id={id} />
        </div>
    );
};

export default PostViewPage;