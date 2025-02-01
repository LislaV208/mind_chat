import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StorageService } from '$lib/features/chat/domain/services/storage.service';
import type { CreateMessageDTO } from '$lib/features/chat/domain/models/chat.model';

const storage = new StorageService();

// GET /api/chats/:id/messages - pobranie historii wiadomości
export const GET: RequestHandler = async ({ params }) => {
    try {
        const { id } = params;
        const messages = storage.getChatMessages(id);

        if (messages === null) {
            return json(
                { error: 'Chat not found' },
                { status: 404 }
            );
        }

        return json({ messages });
    } catch (error) {
        console.error('Error getting messages:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

// POST /api/chats/:id/messages - dodanie nowej wiadomości
export const POST: RequestHandler = async ({ params, request }) => {
    try {
        const { id } = params;
        const body = await request.json() as CreateMessageDTO;

        // Walidacja danych wejściowych
        if (!body.content?.trim()) {
            return json(
                { error: 'Content is required' },
                { status: 400 }
            );
        }

        if (!['user', 'assistant', 'system'].includes(body.role)) {
            return json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        const message = storage.addMessage(id, body);

        if (!message) {
            return json(
                { error: 'Chat not found' },
                { status: 404 }
            );
        }

        return json(message);
    } catch (error) {
        console.error('Error adding message:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
