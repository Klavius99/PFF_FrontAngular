import { User } from './user';

export interface Post {
    id: number;
    content: string;
    text?: string;
    image_url: string | null;
    video_url: string | null;
    user_id: number;
    status: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
    comments_count?: number;
    likes_count?: number;
}

export interface CreatePostDto {
    content: string;
    image?: File;
    video?: File;
}