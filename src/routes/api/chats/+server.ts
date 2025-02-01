import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StorageService } from '$lib/features/chat/domain/services/storage.service';
import type { CreateChatDTO } from '$lib/features/chat/domain/models/chat.model';

const storage = new StorageService();

// GET /api/chats - lista czatów
export const GET: RequestHandler = async () => {
    try {
        const chats = storage.getAllChats();
        return json({ chats });
    } catch (error) {
        console.error('Error getting chats:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};

// POST /api/chats - utworzenie nowego czatu
export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json() as CreateChatDTO;
        
        if (!body.title?.trim()) {
            return json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const chat = storage.createChat(body.title);
        return json(chat);
    } catch (error) {
        console.error('Error creating chat:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
