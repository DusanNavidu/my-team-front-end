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