import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ServerStorageService } from '$lib/features/chat/domain/services/server-storage.service';

const storage = new ServerStorageService();

// GET /api/chats/:id - pobranie szczegółów czatu
export const GET: RequestHandler = async ({ params }) => {
    try {
        const { id } = params;
        console.debug('[GET /api/chats/:id] Getting chat:', id);
        
        const chat = storage.getChat(id);

        if (!chat) {
            console.debug('[GET /api/chats/:id] Chat not found:', id);
            return json(
                { error: 'Chat not found' },
                { status: 404 }
            );
        }

        console.debug('[GET /api/chats/:id] Returning chat:', id);
        return json(chat);
    } catch (error) {
        console.error('[GET /api/chats/:id] Error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

// PATCH /api/chats/:id - aktualizacja metadanych czatu
export const PATCH: RequestHandler = async ({ params, request }) => {
    try {
        const { id } = params;
        const body = await request.json() as { title: string };
        console.debug('[PATCH /api/chats/:id] Updating chat:', id, 'with title:', body.title);

        if (!body.title?.trim()) {
            console.debug('[PATCH /api/chats/:id] Invalid request - missing title');
            return json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const updatedChat = storage.updateChat(id, body.title);

        if (!updatedChat) {
            console.debug('[PATCH /api/chats/:id] Chat not found:', id);
            return json(
                { error: 'Chat not found' },
                { status: 404 }
            );
        }

        console.debug('[PATCH /api/chats/:id] Updated chat:', id);
        return json(updatedChat);
    } catch (error) {
        console.error('[PATCH /api/chats/:id] Error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

// DELETE /api/chats/:id - usunięcie czatu
export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const { id } = params;
        console.debug('[DELETE /api/chats/:id] Deleting chat:', id);
        
        const deleted = storage.deleteChat(id);

        if (!deleted) {
            console.debug('[DELETE /api/chats/:id] Chat not found:', id);
            return json(
                { error: 'Chat not found' },
                { status: 404 }
            );
        }

        console.debug('[DELETE /api/chats/:id] Deleted chat:', id);
        return json({ success: true });
    } catch (error) {
        console.error('[DELETE /api/chats/:id] Error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
