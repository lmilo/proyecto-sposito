export interface User {
    id: number;
    name: string;
    email: string;
    role: 'agent' | 'customer';
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}

export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved';
    user_id: number;
    created_at: string;
}