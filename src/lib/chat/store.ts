import { get, writable } from 'svelte/store';
import type { Message } from './types/message';

export class ChatState {
	constructor(
		readonly messages: Message[],
		readonly status: 'idle' | 'loading',
		readonly error?: string
	) {}
}

export class ChatStore {
	private readonly MAX_MESSAGES = 10;

	private store = writable<ChatState>(new ChatState([], 'idle'));

	subscribe(run: (value: ChatState) => void) {
		return this.store.subscribe(run);
	}

	async onMessageSent(content: string): Promise<void> {
		let state = get(this.store);
		let message: Message = {
			id: state.messages.length + 1,
			role: 'user',
			content: content,
			timestamp: new Date()
		};

		// Dodaj wiadomość użytkownika i ustaw status na loading
		this.store.update((state) => new ChatState([...state.messages, message], 'loading'));

		try {
			// Pobierz aktualny stan po dodaniu wiadomości użytkownika
			state = get(this.store);

			// Pobierz ostatnie wiadomości do wysłania
			const recentMessages = state.messages.slice(-this.MAX_MESSAGES);

			// Wywołaj endpoint API z ostatnimi wiadomościami
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					messages: recentMessages.map(({ role, content }) => ({ role, content }))
				})
			});

			if (!response.ok) {
				throw new Error('Błąd podczas komunikacji z serwerem');
			}

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			state = get(this.store);
			message = {
				id: state.messages.length + 1,
				role: 'assistant',
				content: data.message,
				timestamp: new Date()
			};

			// Dodaj odpowiedź asystenta
			this.store.update((state) => new ChatState([...state.messages, message], 'idle'));
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Wystąpił nieznany błąd';
			this.store.update((state) => new ChatState([...state.messages], 'idle', errorMessage));
		}
	}
}

// Eksportujemy instancję klasy ChatStore
export const chatStore = new ChatStore();
