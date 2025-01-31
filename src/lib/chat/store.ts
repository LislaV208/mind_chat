import { writable } from 'svelte/store';
import type { Message } from './types/message';

export type ChatStatus = 'idle' | 'waiting' | 'streaming';

interface ChatState {
	status: ChatStatus;
	error: string | null;
}

class ChatStore {
	private onUpdate?: () => void;
	private store = writable<ChatState>({
		status: 'idle',
		error: null
	});

	subscribe(run: (value: ChatState) => void) {
		return this.store.subscribe(run);
	}

	setOnUpdate(callback: () => void) {
		this.onUpdate = callback;
	}

	createMessage(role: 'user' | 'assistant', content: string): Message {
		return {
			id: Date.now(),
			role,
			content,
			timestamp: new Date()
		};
	}

	async sendMessage(content: string): Promise<Message> {
		this.store.update((state) => ({
			...state,
			status: 'waiting'
		}));

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					messages: [{ role: 'user', content }]
				})
			});

			if (!response.ok) {
				throw new Error('Błąd podczas komunikacji z serwerem');
			}

			// Sprawdzamy czy response to stream czy zwykła odpowiedź
			const contentType = response.headers.get('content-type');
			let assistantContent = '';

			if (contentType?.includes('stream')) {
				// Obsługa streamu
				if (!response.body) {
					throw new Error('Brak odpowiedzi z serwera');
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder();

				this.store.update((state) => ({ ...state, status: 'streaming' }));

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value);
					assistantContent += chunk;
				}
			} else {
				// Zwykła odpowiedź JSON
				const data = await response.text();
				try {
					const jsonData = JSON.parse(data);
					assistantContent = jsonData.content;
				} catch (e) {
					console.error('Exception: ', e);
					console.error('Błąd parsowania JSON:', data);
					throw new Error('Nieprawidłowy format odpowiedzi z serwera');
				}
			}

			const assistantMessage = this.createMessage('assistant', assistantContent);

			this.store.update((state) => ({
				...state,
				status: 'idle',
				error: null
			}));

			return assistantMessage;
		} catch (error) {
			this.store.update((state) => ({
				...state,
				status: 'idle',
				error: error instanceof Error ? error.message : 'Unknown error'
			}));

			throw error;
		}
	}
}

export const chatStore = new ChatStore();
