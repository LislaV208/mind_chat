import type { ChatMessage, ApiMessage } from '../models/message.model';
import { ChatApi } from '../../api/chat.api';

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
}
