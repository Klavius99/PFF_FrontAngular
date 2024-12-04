import { User } from './user';

export interface Comment {
    id?: number;
    content: string;
    user_id: number;
    post_id: number;
    created_at?: string;
    updated_at?: string;
    user?: User;
}
