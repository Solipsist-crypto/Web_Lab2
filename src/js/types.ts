export interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
    selected: boolean;
}
export interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
    selected: boolean;
}

export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Comment {
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
}
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';