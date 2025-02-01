import type { ApiMessage, Chat, ChatMessage, CreateMessageDTO } from '../domain/models/chat.model';

export class ChatApiError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ChatApiError';
	}
}

export class ChatApi {
	private readonly API_URL = '/api/ai/chat';

	/**
	 * Wysyła wiadomości do API i zwraca stream z odpowiedzią
	 */
	async *streamChat(messages: ApiMessage[]): AsyncGenerator<string> {
		const response = await fetch(this.API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ messages })
		});

		if (!response.ok) {
			throw new ChatApiError('Błąd podczas wysyłania wiadomości');
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new ChatApiError('Brak odpowiedzi z API');
		}

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = new TextDecoder().decode(value);
				yield chunk;
			}
		} finally {
			reader.releaseLock();
		}
	}

	async createChat(title: string): Promise<Chat> {
		const response = await fetch('/api/chats', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title })
		});

		if (!response.ok) {
			throw new ChatApiError('Błąd podczas tworzenia czatu');
		}

		return response.json();
	}

	async deleteChat(id: string): Promise<boolean> {
		const response = await fetch(`/api/chats/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id })
		});

		if (!response.ok) {
			throw new ChatApiError('Błąd podczas usuwania czatu');
		}

		return true;
	}

	async addMessageToChat(id: string, message: CreateMessageDTO): Promise<ChatMessage> {
		const response = await fetch(`/api/chats/${id}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(message)
		});

		if (!response.ok) {
			throw new ChatApiError('Błąd podczas dodawania wiadomości');
		}

		return response.json();
	}

	async getChat(id: string): Promise<Chat> {
		const response = await fetch(`/api/chats/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new ChatApiError('Błąd podczas pobierania czatu');
		}

		return response.json();
	}
}
