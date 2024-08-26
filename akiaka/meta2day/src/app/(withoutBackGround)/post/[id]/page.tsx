import React from 'react';
import fetchPostData from "@/app/(withoutBackGround)/post/[id]/fetchPostData";
import ViewPostForm from "@/app/(withoutBackGround)/post/[id]/viewPostForm";

interface PostPageProps {
    params: { id: string };
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