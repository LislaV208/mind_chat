import type { ApiMessage } from '../domain/models/message.model';

export class ChatApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ChatApiError';
    }
}

export class ChatApi {
    private readonly API_URL = '/api/ai/chat';

    /**
     * Wysyła wiadomości do API i zwraca stream z odpowiedzią
     */
    async *streamChat(messages: ApiMessage[]): AsyncGenerator<string> {
        const response = await fetch(this.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages })
        });

        if (!response.ok) {
            throw new ChatApiError('Błąd podczas wysyłania wiadomości');
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new ChatApiError('Brak odpowiedzi z API');
        }

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = new TextDecoder().decode(value);
                yield chunk;
            }
        } finally {
            reader.releaseLock();
        }
    }
}
