export type ChatStatus = 'idle' | 'loading' | 'streaming';

export interface ChatState {
    status: ChatStatus;
    error: string | null;
    currentMessage: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
