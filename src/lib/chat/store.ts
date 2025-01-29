import { get, writable } from 'svelte/store';
import type { Message } from './types/message';

type ChatStatus = 'idle' | 'waiting' | 'streaming';

export class ChatState {
	constructor(
		readonly messages: Message[],
		readonly status: ChatStatus,
		readonly error?: string
	) {}
}

export class ChatStore {
	private readonly MAX_MESSAGES = 10;
	private onUpdate?: () => void;

	private store = writable<ChatState>(new ChatState([], 'idle'));

	subscribe(run: (value: ChatState) => void) {
		return this.store.subscribe(run);
	}

	setOnUpdate(callback: () => void) {
		this.onUpdate = callback;
	}

	private updateState(
		messages: Message[],
		status: ChatStatus,
		error?: string
	): void {
		this.store.update(() => {
			const newState = new ChatState(messages, status, error);
			this.onUpdate?.();
			return newState;
		});
	}

	private createMessage(role: 'user' | 'assistant', content: string): Message {
		const state = get(this.store);
		return {
			id: state.messages.length + 1,
			role,
			content,
			timestamp: new Date()
		};
	}

	async onMessageSent(content: string): Promise<void> {
		const userMessage = this.createMessage('user', content);
		const state = get(this.store);

		// Dodaj wiadomość użytkownika i ustaw status na waiting
		this.updateState([...state.messages, userMessage], 'waiting');

		try {
			// Pobierz ostatnie wiadomości do wysłania
			const currentState = get(this.store);
			const recentMessages = currentState.messages.slice(-this.MAX_MESSAGES);

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

			if (!response.body) {
				throw new Error('Brak odpowiedzi z serwera');
			}

			// Czytaj strumień odpowiedzi
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let responseContent = '';
			let isFirstChunk = true;

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const text = decoder.decode(value);
				responseContent += text;
				
				// Przy pierwszym fragmencie tworzymy nową wiadomość asystenta
				if (isFirstChunk) {
					const assistantMessage = this.createMessage('assistant', responseContent);
					const currentState = get(this.store);
					this.updateState([...currentState.messages, assistantMessage], 'streaming');
					isFirstChunk = false;
				} else {
					// Aktualizujemy treść ostatniej wiadomości
					const currentState = get(this.store);
					const messages = [...currentState.messages];
					const lastMessage = messages[messages.length - 1];
					if (lastMessage && lastMessage.role === 'assistant') {
						lastMessage.content = responseContent;
						this.updateState(messages, 'streaming');
					}
				}
			}

			// Zakończ ładowanie
			const finalState = get(this.store);
			this.updateState(finalState.messages, 'idle');
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Wystąpił nieznany błąd';
			const errorState = get(this.store);
			this.updateState(errorState.messages, 'idle', errorMessage);
		}
	}
}

// Eksportujemy instancję klasy ChatStore
export const chatStore = new ChatStore();
