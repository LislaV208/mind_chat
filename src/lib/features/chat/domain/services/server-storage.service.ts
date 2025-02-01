import type { Chat, ChatMessage, CreateMessageDTO } from '../models/chat.model';

/**
 * Prosty serwis do przechowywania danych w pamięci po stronie serwera
 */
export class ServerStorageService {
	private static chats: Chat[] = [];

	getAllChats(): Chat[] {
		return ServerStorageService.chats;
	}

	createChat(title: string): Chat {
		const chats = ServerStorageService.chats;

		const newChat: Chat = {
			id: crypto.randomUUID(),
			title,
			createdAt: new Date(),
			updatedAt: new Date(),
			messages: []
		};

		console.log('Creating chat:', newChat);

		ServerStorageService.chats = [...chats, newChat];
		return newChat;
	}

	getChat(id: string): Chat | null {
		return ServerStorageService.chats.find((chat) => chat.id === id) || null;
	}

	updateChat(id: string, title: string): Chat | null {
		const chatIndex = ServerStorageService.chats.findIndex((chat) => chat.id === id);
		if (chatIndex === -1) return null;

		const updatedChat: Chat = {
			...ServerStorageService.chats[chatIndex],
			title,
			updatedAt: new Date()
		};

		ServerStorageService.chats[chatIndex] = updatedChat;
		return updatedChat;
	}

	deleteChat(id: string): boolean {
		const initialLength = ServerStorageService.chats.length;
		ServerStorageService.chats = ServerStorageService.chats.filter((chat) => chat.id !== id);
		return ServerStorageService.chats.length !== initialLength;
	}

	getChatMessages(chatId: string): ChatMessage[] | null {
		const chat = this.getChat(chatId);
		return chat?.messages || null;
	}

	addMessage(chatId: string, messageData: CreateMessageDTO): ChatMessage | null {
		console.log('Adding message to chat:', chatId, 'body:', messageData);

		const chatIndex = ServerStorageService.chats.findIndex((chat) => chat.id === chatId);
		console.log('Chat index:', chatIndex);

		if (chatIndex === -1) return null;

		const newMessage: ChatMessage = {
			id: crypto.randomUUID(),
			...messageData,
			timestamp: new Date()
		};

		ServerStorageService.chats[chatIndex].messages.push(newMessage);
		ServerStorageService.chats[chatIndex].updatedAt = new Date();

		return newMessage;
	}
}
