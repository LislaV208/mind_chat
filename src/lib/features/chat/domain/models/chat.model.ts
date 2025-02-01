export interface Chat {
	id: string;
	title: string;
	createdAt: Date;
	updatedAt: Date;
	messages: ChatMessage[];
}

export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp: Date;
}

export interface CreateChatDTO {
	title: string;
}

export interface CreateMessageDTO {
	role: ChatMessage['role'];
	content: string;
}

export interface ApiMessage {
	role: ChatMessage['role'];
	content: string;
}
