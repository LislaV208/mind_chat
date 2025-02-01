import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ServerStorageService } from '$lib/features/chat/domain/services/server-storage.service';
import type { CreateMessageDTO } from '$lib/features/chat/domain/models/chat.model';

const storage = new ServerStorageService();

// GET /api/chats/:id/messages - pobranie historii wiadomości
export const GET: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;
		console.debug('[GET /api/chats/:id/messages] Getting messages for chat:', id);

		const messages = storage.getChatMessages(id);

		if (messages === null) {
			console.debug('[GET /api/chats/:id/messages] Chat not found:', id);
			return json({ error: 'Chat not found' }, { status: 404 });
		}

		console.debug('[GET /api/chats/:id/messages] Returning messages:', messages.length);
		return json({ messages });
	} catch (error) {
		console.error('[GET /api/chats/:id/messages] Error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// POST /api/chats/:id/messages - dodanie nowej wiadomości
export const POST: RequestHandler = async ({ params, request }) => {
	try {
		const { id } = params;
		const body = (await request.json()) as CreateMessageDTO;
		console.debug('[POST /api/chats/:id/messages] Adding message to chat:', id, 'body:', body);

		// Walidacja danych wejściowych
		if (!body.content?.trim()) {
			console.debug('[POST /api/chats/:id/messages] Invalid request - missing content');
			return json({ error: 'Content is required' }, { status: 400 });
		}

		if (!['user', 'assistant', 'system'].includes(body.role)) {
			console.debug('[POST /api/chats/:id/messages] Invalid request - invalid role:', body.role);
			return json({ error: 'Invalid role' }, { status: 400 });
		}

		const message = storage.addMessage(id, body);

		if (!message) {
			console.debug('[POST /api/chats/:id/messages] Chat not found:', id);
			return json({ error: 'Chat not found' }, { status: 404 });
		}

		console.debug('[POST /api/chats/:id/messages] Added message:', message.id);
		return json(message);
	} catch (error) {
		console.error('[POST /api/chats/:id/messages] Error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
