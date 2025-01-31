import { writable, get } from 'svelte/store';
import type { ChatState } from './types';
import { ChatService } from './domain/services/chat.service';

function createChatStore() {
	const store = writable<ChatState>({
		status: 'idle',
		error: null,
		messages: []
	});

	const { subscribe, update } = store;
	const chatService = new ChatService();

	return {
		subscribe,

		setStatus: (status: ChatState['status']) => {
			update((state) => ({ ...state, status }));
		},

		setError: (error: string | null) => {
			update((state) => ({ ...state, error }));
		},

		async sendMessage(content: string): Promise<void> {
			try {
				update((state) => ({ ...state, status: 'loading', error: null }));

				// Tworzymy i dodajemy wiadomość użytkownika
				const userMessage = chatService.createMessage('user', content);
				update((state) => ({
					...state,
					messages: [...state.messages, userMessage]
				}));

				// Tworzymy pustą wiadomość asystenta od razu
				const assistantMessage = chatService.createMessage('assistant', '');
				update((state) => ({
					...state,
					messages: [...state.messages, assistantMessage]
				}));

				// Ustawiamy status na streaming
				update((state) => ({ ...state, status: 'streaming' }));

				// Pobieramy aktualny stan przed streamowaniem
				const currentState = get(store);

				// Iterujemy po streamie odpowiedzi
				try {
					for await (const chunk of chatService.streamResponse(content, currentState.messages)) {
						// Aktualizujemy treść wiadomości asystenta
						assistantMessage.content += chunk;
						update((state) => ({
							...state,
							messages: state.messages.map((msg) =>
								msg.id === assistantMessage.id ? assistantMessage : msg
							)
						}));
					}
				} catch (error) {
					// Usuwamy pustą wiadomość asystenta w przypadku błędu
					update((state) => ({
						...state,
						messages: state.messages.filter((msg) => msg.id !== assistantMessage.id)
					}));
					throw error;
				}

				update((state) => ({ ...state, status: 'idle' }));
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
				update((state) => ({
					...state,
					status: 'idle',
					error: errorMessage
				}));
			}
		}
	};
}

export const chatStore = createChatStore();
