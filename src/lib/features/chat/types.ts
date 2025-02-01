import type { Chat, ChatMessage } from './domain/models/chat.model';

export type ChatStatus = 'idle' | 'loading' | 'streaming';

export interface ChatState {
	status: ChatStatus;
	error: string | null;
	chats: Chat[];
	currentChat: Chat | null;
	messages: ChatMessage[];
}
