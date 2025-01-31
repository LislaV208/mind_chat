import { get, writable } from 'svelte/store';
import type { Conversation, ConversationSummary, StoredConversation, StoredMessage, StoredHistoryState } from './types/history.types';
import type { Message } from './types/message';

export class HistoryState {
    constructor(readonly conversations: Conversation[] = []) {}
}

export class HistoryStore {
    private readonly MAX_CONVERSATIONS = 50;
    private store = writable<HistoryState>(new HistoryState());

    constructor() {
        this.loadConversationsFromStorage();
    }

    subscribe(run: (value: HistoryState) => void) {
        return this.store.subscribe(run);
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    createConversation(firstMessage: Message): Conversation {
        const conversation: Conversation = {
            id: this.generateId(),
            title: firstMessage.content.substring(0, 50) + (firstMessage.content.length > 50 ? '...' : ''),
            lastMessage: firstMessage.content,
            messages: [firstMessage],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.store.update(state => {
            const conversations = [conversation, ...state.conversations];
            // Limit the number of stored conversations
            if (conversations.length > this.MAX_CONVERSATIONS) {
                conversations.pop();
            }
            return { conversations };
        });

        this.saveToStorage();
        return conversation;
    }

    updateConversation(id: string, message: Message): void {
        this.store.update(state => {
            const conversations = state.conversations.map(conv => {
                if (conv.id === id) {
                    return {
                        ...conv,
                        lastMessage: message.content,
                        messages: [...conv.messages, message],
                        updatedAt: new Date()
                    };
                }
                return conv;
            });

            return { conversations };
        });

        this.saveToStorage();
    }

    getConversation(id: string): Conversation | undefined {
        return get(this.store).conversations.find(conv => conv.id === id);
    }

    getConversationSummaries(): ConversationSummary[] {
        return get(this.store).conversations.map(({ id, title, lastMessage, createdAt, updatedAt }) => ({
            id,
            title,
            lastMessage,
            createdAt,
            updatedAt
        }));
    }

    loadConversationsFromStorage(): void {
        try {
            const stored = localStorage.getItem('chat_history');
            if (!stored) return;

            const parsed = JSON.parse(stored) as StoredHistoryState;
            if (!Array.isArray(parsed.conversations)) {
                throw new Error('Invalid storage format');
            }

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

            this.store.set({ conversations });
        } catch (error) {
            console.error('Failed to load chat history:', error);
            // Reset to empty state on error
            this.store.set(new HistoryState());
        }
    }

    private saveToStorage(): void {
        try {
            const state = get(this.store);
            localStorage.setItem('chat_history', JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }
}

// Eksportujemy instancję klasy HistoryStore
export const historyStore = new HistoryStore();
