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
	private store = writable<ChatState>(
		new ChatState(
			[
				{
					id: 0,
					role: 'assistant',
					content: 'Cześć! W czym mogę Ci dzisiaj pomóc?',
					timestamp: new Date()
				}
			],
			'idle'
		)
	);

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
			// Wywołaj endpoint API tylko z ostatnią wiadomością użytkownika
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					messages: [{ role: 'user', content: content }]
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
