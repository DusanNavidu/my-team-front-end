import api from "./api";

export const createPostService = async (formData: FormData) => {
    const response = await api.post("/post/create-post", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export interface PostData {
    _id: string;
    userId: string;
    playerPostImageFileURL: string;
    title: string;
    mention: string[];
    feeling: string;
    description: string;
    tagInput: string[];
    userRole: string;
    status: string;
    likes: string[];
    comments: string[];
    createdAt: string;
}

export const getMyPosts = async (): Promise<PostData[]> => {
    const response = await api.get("/post/getmeposts");
    return response.data.data; 
};

export const getMyStoryService = async (): Promise<PostData[]> => {
    const response = await api.get("/post/getmestory");
    return response.data.data;
};

export const getTenLatestStories = async (): Promise<PostData[]> => {
    const response = await api.get("/post/gettenlateststories");
    return response.data.data;
};

export const getAllPostsService = async (): Promise<PostData[]> => {
    const response = await api.get("/post/getallposts");
    return response.data.data;
};

export const getPlayerPostsById = async (id: string) => {
    const response = await api.get(`/post/player/${id}`);
    return response.data;
};

export const deletePostService = async (id: string) => {
    return (await api.delete(`/post/delete/${id}`)).data;
};

export const updatePostService = async (id: string, data: any) => {
    return (await api.put(`/post/update/${id}`, data)).data;
};

export const likePostService = async (postId: string) => {
    const response = await api.put(`/post/like/${postId}`);
    return response.data;
};