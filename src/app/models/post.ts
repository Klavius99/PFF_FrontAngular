export interface Post {
    id: number;
    text: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreatePostDto {
    text: string;
    image?: File;
  }