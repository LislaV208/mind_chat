export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ApiMessage {
    role: ChatMessage['role'];
    content: string;
}
