import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StorageService } from '$lib/features/chat/domain/services/storage.service';

const storage = new StorageService();

// GET /api/chats/:id - pobranie szczegółów czatu
export const GET: RequestHandler = async ({ params }) => {
    try {
        const { id } = params;
        const chat = storage.getChat(id);

        if (!chat) {
            return json(
                { error: 'Chat not found' },
                { status: 404 }
            );
        }

        return json(chat);
    } catch (error) {
        console.error('Error getting chat:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

// PATCH /api/chats/:id - aktualizacja metadanych czatu
export const PATCH: RequestHandler = async ({ params, request }) => {
    try {
        const { id } = params;
        const body = await request.json() as { title: string };

        if (!body.title?.trim()) {
            return json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const updatedChat = storage.updateChat(id, body.title);

        if (!updatedChat) {
            return json(
                { error: 'Chat not found' },
                { status: 404 }
            );
        }

        return json(updatedChat);
    } catch (error) {
        console.error('Error updating chat:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

// DELETE /api/chats/:id - usunięcie czatu
export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const { id } = params;
        const deleted = storage.deleteChat(id);

        if (!deleted) {
            return json(
                { error: 'Chat not found' },
                { status: 404 }
            );
        }

        return json({ success: true });
    } catch (error) {
        console.error('Error deleting chat:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
