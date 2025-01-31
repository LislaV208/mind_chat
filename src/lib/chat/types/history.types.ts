import type { Message } from './message';

export interface Conversation {
	id: string;
	title: string;
	messages: Message[];
	lastMessage: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface HistoryState {
	conversations: Conversation[];
	activeConversationId: string | null;
}

// Typy pomocnicze do localStorage
export interface StoredMessage {
	id: number;
	role: 'user' | 'assistant';
	content: string;
	timestamp: string; // Data jako string w localStorage
}

export interface StoredConversation {
	id: string;
	title: string;
	messages: StoredMessage[];
	lastMessage: string;
	createdAt: string; // Data jako string w localStorage
	updatedAt: string; // Data jako string w localStorage
}
