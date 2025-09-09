
export interface User {
    name: string;
    handle: string;
    avatarUrl: string;
}

export interface Post {
    id: number;
    user: User;
    time: string;
    text: string;
    imageUrl?: string | null;
    likes: number;
    comments: number;
}

export interface Stat {
    label: string;
    value: string;
    change: string;
}

export interface IconProps {
    className?: string;
}
