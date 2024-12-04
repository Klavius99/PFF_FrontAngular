import { User } from './user';

export interface Post {
    id: number;
    text: string;
    content?: string;
    image_url: string | null;
    video_url?: string | null;
    user_id?: number;
    status?: boolean;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        username: string;
        email: string;
        profile_picture?: string;
        role: 'apprenant' | 'formateur' | 'info_manager';
    };
    comments_count?: number;
    likes_count?: number;
}

export interface CreatePostDto {
    text: string;
    image?: File;
}