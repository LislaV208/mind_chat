import { writable, get } from 'svelte/store';
import type { ChatState } from './types';
import { ChatService } from './domain/services/chat.service';

function createChatStore() {
	const store = writable<ChatState>({
		status: 'idle',
		error: null,
		chats: [],
		currentChat: null,
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

		async createChat(title: string): Promise<void> {
			try {
				const chat = await chatService.createChat(title);
				update((state) => ({
					...state,
					chats: [chat, ...state.chats],
					currentChat: chat,
					messages: chat.messages
				}));
			} catch (error) {
				console.error('Error creating chat:', error);
				update((state) => ({ ...state, error: 'Failed to create chat' }));
			}
		},

		async deleteChat(id: string): Promise<void> {
			try {
				await chatService.deleteChat(id);
				update((state) => ({
					...state,
					chats: state.chats.filter((chat) => chat.id !== id),
					currentChat: id === state.currentChat?.id ? null : state.currentChat,
					messages: id === state.currentChat?.id ? [] : state.messages
				}));
			} catch (error) {
				console.error('Error deleting chat:', error);
				update((state) => ({ ...state, error: 'Failed to delete chat' }));
			}
		},

		async onChatSelected(id: string): Promise<void> {
			try {
				if (id === get(store).currentChat?.id) return;

				const chat = await chatService.getChat(id);
				update((state) => ({ ...state, currentChat: chat, messages: chat.messages }));
			} catch (error) {
				console.error('Error selecting chat:', error);
				update((state) => ({ ...state, error: 'Failed to select chat' }));
			}
		},

		async sendMessage(content: string): Promise<void> {
			try {
				update((state) => ({ ...state, status: 'loading', error: null }));

				// Tworzymy nowy chat jezeli nie jest on jeszcze utworzony
				if (!get(store).currentChat) {
					await this.createChat(content);
				}

				// Tworzymy i dodajemy wiadomość użytkownika
				const userMessage = chatService.createMessage('user', content);
				update((state) => ({
					...state,
					messages: [...state.messages, userMessage]
				}));

				await chatService.addMessageToChat(get(store).currentChat!.id, { role: 'user', content });

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
					for await (const chunk of chatService.streamResponse(currentState.messages)) {
						// Aktualizujemy treść wiadomości asystenta
						assistantMessage.content += chunk;
						update((state) => ({
							...state,
							messages: state.messages.map((msg) =>
								msg.id === assistantMessage.id ? assistantMessage : msg
							)
						}));
					}

					await chatService.addMessageToChat(get(store).currentChat!.id, {
						role: 'assistant',
						content: assistantMessage.content
					});
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
