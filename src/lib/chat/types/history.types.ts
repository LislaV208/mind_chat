import type { Message } from './message';

export interface Conversation {
    id: string;
    title: string;
    lastMessage: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ConversationSummary {
    id: string;
    title: string;
    lastMessage: string;
    createdAt: Date;
    updatedAt: Date;
}

// Interfejsy dla danych z localStorage (przed konwersją dat)
export interface StoredMessage {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface StoredConversation {
    id: string;
    title: string;
    lastMessage: string;
    messages: StoredMessage[];
    createdAt: string;
    updatedAt: string;
}

export interface StoredHistoryState {
    conversations: StoredConversation[];
}
