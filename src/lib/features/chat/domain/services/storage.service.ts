import type { Chat, ChatMessage, CreateMessageDTO } from '../models/chat.model';

const CHATS_STORAGE_KEY = 'mind-map-chat:chats';

export class StorageService {
    private getChats(): Chat[] {
        if (typeof window === 'undefined') return [];
        
        const chatsJson = localStorage.getItem(CHATS_STORAGE_KEY);
        if (!chatsJson) return [];

        try {
            return JSON.parse(chatsJson);
        } catch (error) {
            console.error('Error parsing chats from localStorage:', error);
            return [];
        }
    }

    private saveChats(chats: Chat[]): void {
        if (typeof window === 'undefined') return;
        
        try {
            localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
        } catch (error) {
            console.error('Error saving chats to localStorage:', error);
        }
    }

    getAllChats(): Chat[] {
        return this.getChats();
    }

    createChat(title: string): Chat {
        const chats = this.getChats();
        
        const newChat: Chat = {
            id: crypto.randomUUID(),
            title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: []
        };

        this.saveChats([...chats, newChat]);
        return newChat;
    }

    getChat(id: string): Chat | null {
        const chats = this.getChats();
        return chats.find(chat => chat.id === id) || null;
    }

    updateChat(id: string, title: string): Chat | null {
        const chats = this.getChats();
        const chatIndex = chats.findIndex(chat => chat.id === id);
        
        if (chatIndex === -1) return null;

        const updatedChat: Chat = {
            ...chats[chatIndex],
            title,
            updatedAt: new Date().toISOString()
        };

        chats[chatIndex] = updatedChat;
        this.saveChats(chats);

        return updatedChat;
    }

    deleteChat(id: string): boolean {
        const chats = this.getChats();
        const filteredChats = chats.filter(chat => chat.id !== id);
        
        if (filteredChats.length === chats.length) return false;
        
        this.saveChats(filteredChats);
        return true;
    }

    getChatMessages(chatId: string): ChatMessage[] | null {
        const chat = this.getChat(chatId);
        if (!chat) return null;
        return chat.messages;
    }

    addMessage(chatId: string, messageData: CreateMessageDTO): ChatMessage | null {
        const chats = this.getChats();
        const chatIndex = chats.findIndex(chat => chat.id === chatId);
        
        if (chatIndex === -1) return null;

        const newMessage: ChatMessage = {
            id: crypto.randomUUID(),
            ...messageData,
            timestamp: new Date().toISOString()
        };

        chats[chatIndex] = {
            ...chats[chatIndex],
            messages: [...chats[chatIndex].messages, newMessage],
            updatedAt: new Date().toISOString()
        };

        this.saveChats(chats);
        return newMessage;
    }
}
