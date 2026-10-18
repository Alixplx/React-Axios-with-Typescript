
export interface CreatePostInput {

    title: string;
    body: string;
    userId: number;
}
  
export interface Post extends CreatePostInput {

    id: number;
}