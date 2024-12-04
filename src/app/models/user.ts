export interface User {
    id?: string;
    username: string;
    email: string;
    password?: string;
    profile_picture?: string;
    role?: 'super_admin' | 'admin' | 'info_manager' | 'formateur' | 'apprenant';
    status?: boolean;
    created_at?: Date;
}

export interface AuthResponse {
    token: string;
    user: Omit<User, 'password'>;
}
