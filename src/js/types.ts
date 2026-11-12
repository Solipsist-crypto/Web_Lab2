// === Типи предметної області ===

export interface Product {
    readonly id: number;
    readonly createdAt: string;
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

// === Дискриміноване об'єднання стану ===

export type RequestState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: Product[] }
    | { status: 'error'; message: string };

// === Захисник типу (type guard) ===

export function isProduct(value: unknown): value is Product {
    return (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        typeof (value as Product).id === 'number' &&
        'title' in value &&
        typeof (value as Product).title === 'string' &&
        'price' in value &&
        typeof (value as Product).price === 'number'
    );
}

// === Утилітарні типи ===

export type ProductDraft = Omit<Product, 'id' | 'createdAt' | 'selected'>;
export type ProductPatch = Partial<ProductDraft>;
export type ProductCard = Pick<Product, 'id' | 'title' | 'price'>;
export type PriceIndex = Record<string, number>;

// === Типи для змінних оточення (import.meta.env) ===

declare global {
    interface ImportMetaEnv {
        readonly VITE_API_URL: string;
    }
    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}