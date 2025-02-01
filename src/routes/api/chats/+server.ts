import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ServerStorageService } from '$lib/features/chat/domain/services/server-storage.service';
import type { CreateChatDTO } from '$lib/features/chat/domain/models/chat.model';

const storage = new ServerStorageService();

// GET /api/chats - lista czatów
export const GET: RequestHandler = async () => {
    try {
        const chats = storage.getAllChats();
        console.debug('[GET /api/chats] Returning chats:', chats.length);
        return json({ chats });
    } catch (error) {
        console.error('[GET /api/chats] Error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

// POST /api/chats - utworzenie nowego czatu
export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json() as CreateChatDTO;
        console.debug('[POST /api/chats] Creating chat with title:', body.title);
        
        if (!body.title?.trim()) {
            console.debug('[POST /api/chats] Invalid request - missing title');
            return json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const chat = storage.createChat(body.title);
        console.debug('[POST /api/chats] Created chat:', chat.id);
        return json(chat);
    } catch (error) {
        console.error('[POST /api/chats] Error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
