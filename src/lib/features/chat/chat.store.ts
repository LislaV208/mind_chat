import { writable } from 'svelte/store';
import type { ChatState, ChatMessage } from './types';

function createChatStore() {
	const { subscribe, update } = writable<ChatState>({
		status: 'idle',
		error: null,
		currentMessage: ''
	});

	let onUpdateCallback: (() => void) | null = null;

	return {
		subscribe,

		setStatus: (status: ChatState['status']) => {
			update((state) => ({ ...state, status }));
		},

		setError: (error: string | null) => {
			update((state) => ({ ...state, error }));
		},

		setOnUpdate: (callback: () => void) => {
			onUpdateCallback = callback;
		},

		createMessage: (role: ChatMessage['role'], content: string): ChatMessage => {
			return {
				id: crypto.randomUUID(),
				role,
				content,
				timestamp: new Date()
			};
		},

		async sendMessage(content: string): Promise<ChatMessage | null> {
			try {
				update((state) => ({ ...state, status: 'loading', error: null }));

				const response = await fetch('/api/chat', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ messages: [{ role: 'user', content }] })
				});

				if (!response.ok) {
					throw new Error('Failed to send message');
				}

				const data = await response.json();

				update((state) => ({ ...state, status: 'idle' }));
				onUpdateCallback?.();

				return this.createMessage('assistant', data.content);
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				update((state) => ({
					...state,
					status: 'idle',
					error: errorMessage
				}));
				return null;
			}
		}
	};
}

export const chatStore = createChatStore();
