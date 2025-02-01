export interface Chat {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: ChatMessage[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

export interface CreateChatDTO {
    title: string;
}

export interface CreateMessageDTO {
    role: ChatMessage['role'];
    content: string;
}
