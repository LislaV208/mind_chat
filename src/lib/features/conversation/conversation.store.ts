import { writable } from 'svelte/store';
import type { Conversation, Message } from './types';

interface ConversationState {
	conversations: Conversation[];
	activeConversationId: string | null;
}

function createConversationStore() {
	const { subscribe, update } = writable<ConversationState>({
		conversations: [],
		activeConversationId: null
	});

	return {
		subscribe,

		setActiveConversation: (id: string) => {
			update((state) => ({ ...state, activeConversationId: id }));
		},

		addMessage: (message: Message) => {
			update((state) => {
				const conversation = state.conversations.find((c) => c.id === state.activeConversationId);
				if (conversation) {
					conversation.messages = [...conversation.messages, message];
					conversation.lastMessage = message.content;
					conversation.updatedAt = new Date();
				}
				return state;
			});
		},

		createConversation: () => {
			const newConversation: Conversation = {
				id: crypto.randomUUID(),
				title: 'Nowa konwersacja',
				messages: [],
				createdAt: new Date(),
				updatedAt: new Date()
			};

			update((state) => ({
				...state,
				conversations: [...state.conversations, newConversation],
				activeConversationId: newConversation.id
			}));

			return newConversation.id;
		},

		deleteConversation: (id: string) => {
			update((state) => ({
				...state,
				conversations: state.conversations.filter((c) => c.id !== id),
				activeConversationId: state.activeConversationId === id ? null : state.activeConversationId
			}));
		}
	};
}

export const conversationStore = createConversationStore();
