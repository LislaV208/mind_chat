import { ChatApi } from '../../api/chat.api';
import type { ApiMessage, Chat, ChatMessage, CreateMessageDTO } from '../models/chat.model';

export class ChatService {
	private readonly chatApi: ChatApi;

	constructor() {
		this.chatApi = new ChatApi();
	}

	/**
	 * Tworzy nową wiadomość czatu
	 */
	createMessage(role: ChatMessage['role'], content: string): ChatMessage {
		return {
			id: crypto.randomUUID(),
			role,
			content,
			timestamp: new Date()
		};
	}

	/**
	 * Waliduje treść wiadomości
	 * @param content Treść wiadomości
	 */
	private validateMessage(content: string): boolean {
		return content.trim().length > 0;
	}

	/**
	 * Przygotowuje wiadomości do wysłania do API
	 * @param messages Lista wiadomości
	 */
	private prepareMessages(messages: ChatMessage[]): ApiMessage[] {
		return messages.map(({ role, content }) => ({
			role,
			content
		}));
	}

	/**
	 * Streamuje odpowiedź z API
	 * @param messages Historia konwersacji
	 */
	async *streamResponse(messages: ChatMessage[] = []): AsyncGenerator<string> {
		const apiMessages = this.prepareMessages(messages);

		for await (const chunk of this.chatApi.streamChat(apiMessages)) {
			yield chunk;
		}
	}

	async createChat(title: string): Promise<Chat> {
		const chat = await this.chatApi.createChat(title);

		return chat;
	}

	async deleteChat(id: string): Promise<void> {
		await this.chatApi.deleteChat(id);
	}

	async addMessageToChat(id: string, message: CreateMessageDTO): Promise<ChatMessage> {
		const chatMessage = await this.chatApi.addMessageToChat(id, message);
		return chatMessage;
	}

	async getChat(id: string): Promise<Chat> {
		const chat = await this.chatApi.getChat(id);
		return chat;
	}
}
