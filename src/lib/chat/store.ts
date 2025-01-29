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
			[{ id: 0, role: 'assistant', content: 'Hello, how can I help you?', timestamp: new Date() }],
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

		this.store.update((state) => new ChatState([...state.messages, message], 'loading'));
		let error: string | undefined = undefined;

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			state = get(this.store);
			message = {
				id: state.messages.length + 1,
				role: 'assistant',
				content: 'Hello, how can I help you today?',
				timestamp: new Date()
			};

			this.store.update((state) => new ChatState([...state.messages, message], 'idle', error));
		} catch {
			error = 'An error occurred';
		}
		this.store.update((state) => new ChatState([...state.messages], 'idle', error));
	}
}

// Eksportujemy instancję klasy ChatStore
export const chatStore = new ChatStore();
