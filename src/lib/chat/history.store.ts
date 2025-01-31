import { get, writable } from 'svelte/store';
import type { Conversation, HistoryState, StoredConversation, StoredMessage } from './types/history.types';
import type { Message } from './types/message';

const STORAGE_KEY = 'chat_history';
const DEFAULT_TITLE = 'Nowa konwersacja';

class HistoryStore {
	private store = writable<HistoryState>({
		conversations: [],
		activeConversationId: null
	});

	constructor() {
		this.loadConversationsFromStorage();
	}

	subscribe(run: (value: HistoryState) => void) {
		return this.store.subscribe(run);
	}

	// Główne metody do zarządzania konwersacjami
	createConversation(): string {
		const conversation: Conversation = {
			id: crypto.randomUUID(),
			title: DEFAULT_TITLE,
			messages: [],
			lastMessage: '',
			createdAt: new Date(),
			updatedAt: new Date()
		};

		this.store.update((state) => {
			state.conversations = [conversation, ...state.conversations];
			state.activeConversationId = conversation.id;
			return state;
		});

		this.saveToStorage();
		return conversation.id;
	}

	setActiveConversation(id: string | null): void {
		this.store.update((state) => {
			state.activeConversationId = id;
			return state;
		});
	}

	getActiveConversation(): Conversation | null {
		const state = get(this.store);
		if (!state.activeConversationId) return null;
		return this.getConversation(state.activeConversationId);
	}

	addMessage(message: Message): void {
		const state = get(this.store);
		if (!state.activeConversationId) return;

		this.store.update((state) => {
			const conversation = state.conversations.find(c => c.id === state.activeConversationId);
			if (conversation) {
				// Jeśli to pierwsza wiadomość użytkownika, ustaw tytuł konwersacji
				if (conversation.messages.length === 0 && message.role === 'user') {
					conversation.title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
				}

				conversation.messages = [...conversation.messages, message];
				conversation.lastMessage = message.content;
				conversation.updatedAt = new Date();
			}
			return state;
		});

		this.saveToStorage();
	}

	deleteConversation(id: string): void {
		this.store.update((state) => {
			// Usuń konwersację
			const conversations = state.conversations.filter((c) => c.id !== id);

			// Jeśli usunięto aktywną konwersację
			if (state.activeConversationId === id) {
				// Jeśli są inne konwersacje, ustaw najnowszą jako aktywną
				const newActiveConversation = conversations[conversations.length - 1];
				return {
					...state,
					conversations,
					activeConversationId: newActiveConversation?.id || null
				};
			}

			return {
				...state,
				conversations
			};
		});

		this.saveToStorage();
	}

	// Metody pomocnicze
	private getConversation(id: string): Conversation | null {
		const state = get(this.store);
		return state.conversations.find(c => c.id === id) || null;
	}

	private loadConversationsFromStorage(): void {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) return;

			const parsed = JSON.parse(stored);
			if (!Array.isArray(parsed.conversations)) return;

			const conversations = parsed.conversations.map((conv: StoredConversation) => ({
				...conv,
				createdAt: new Date(conv.createdAt),
				updatedAt: new Date(conv.updatedAt),
				messages: Array.isArray(conv.messages)
					? conv.messages.map((msg: StoredMessage) => ({
							...msg,
							timestamp: new Date(msg.timestamp)
					  }))
					: []
			}));

			this.store.update((state) => {
				state.conversations = conversations;
				return state;
			});
		} catch (error) {
			console.error('Błąd podczas ładowania historii:', error);
		}
	}

	private saveToStorage(): void {
		try {
			const state = get(this.store);
			const storedConversations: StoredConversation[] = state.conversations.map((conv) => ({
				...conv,
				createdAt: conv.createdAt.toISOString(),
				updatedAt: conv.updatedAt.toISOString(),
				messages: conv.messages.map((msg) => ({
					...msg,
					timestamp: msg.timestamp.toISOString()
				}))
			}));

			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					conversations: storedConversations
				})
			);
		} catch (error) {
			console.error('Błąd podczas zapisywania historii:', error);
		}
	}
}

export const historyStore = new HistoryStore();
