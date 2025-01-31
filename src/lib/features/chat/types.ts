import type { ChatMessage } from './domain/models/message.model';

export type ChatStatus = 'idle' | 'loading' | 'streaming';

export interface ChatState {
    status: ChatStatus;
    error: string | null;
    messages: ChatMessage[];
}
