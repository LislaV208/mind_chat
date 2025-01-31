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
	 * @param content Treść wiadomości
	 * @param messages Historia konwersacji
	 */
	async *streamResponse(content: string, messages: ChatMessage[] = []): AsyncGenerator<string> {
		if (!this.validateMessage(content)) {
			throw new Error('Wiadomość nie może być pusta');
		}

		const userMessage = this.createMessage('user', content);
		const allMessages = [...messages, userMessage];
		const preparedMessages = this.prepareMessages(allMessages);

		for await (const chunk of this.chatApi.streamChat(preparedMessages)) {
			yield chunk;
		}
	}
}
