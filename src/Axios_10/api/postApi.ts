import api from "./axios"
import type { CreatePostInput, Post } from "../types/post"


export async function createPost(data: CreatePostInput): Promise<Post> {

    const response = await api.post<Post>("/posts", data);

    return response.data;
}