import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

const SYSTEM_MESSAGE = `Jesteś asystentem do pomagania w nauce, jednak starasz się to robić w sposób zabawny i wulgarny, z przekleństwami.`;

// Ustaw na true aby używać mocka zamiast prawdziwego API
const USE_MOCK_RESPONSE = false;

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Jeśli używamy mocka, zwróć przykładową odpowiedź
		if (USE_MOCK_RESPONSE) {
			// Tworzymy nowy ReadableStream
			const stream = new ReadableStream({
				async start(controller) {
					try {
						// Symulujemy odpowiedź bota w chunkach
						const response = 'To jest przykładowa odpowiedź bota. Używamy teraz zamockowanego API.';
						const chunks = response.split(' ');

						for (const chunk of chunks) {
							// Dodajemy spację po każdym słowie oprócz ostatniego
							const text = chunk + (chunk !== chunks[chunks.length - 1] ? ' ' : '');

							// Wysyłamy chunk
							controller.enqueue(new TextEncoder().encode(text));

							// Symulujemy opóźnienie między chunkami
							await new Promise((resolve) => setTimeout(resolve, 100));
						}

						controller.close();
					} catch (error) {
						controller.error(error);
					}
				}
			});

			// Zwracamy stream jako response
			return new Response(stream, {
				headers: {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					Connection: 'keep-alive'
				}
			});
		}

		const { messages } = await request.json();

		const stream = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: SYSTEM_MESSAGE },
				...messages.map(({ role, content }: { role: string; content: string }) => ({
					role,
					content
				}))
			],
			temperature: 0.7,
			max_tokens: 1000,
			stream: true
		});

		// Tworzymy nowy ReadableStream
		const textStream = new ReadableStream({
			async start(controller) {
				for await (const chunk of stream) {
					const content = chunk.choices[0]?.delta?.content;
					if (content) {
						controller.enqueue(new TextEncoder().encode(content));
					}
				}
				controller.close();
			}
		});

		// Zwracamy strumień jako odpowiedź
		return new Response(textStream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		});
	} catch (error) {
		console.error('Error in chat endpoint:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
