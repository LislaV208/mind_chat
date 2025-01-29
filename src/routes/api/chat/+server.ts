import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

const SYSTEM_MESSAGE = `Jesteś pomocnym asystentem, który pomaga w nauce. 
    Twoje odpowiedzi powinny być rzeczowe i na temat. 
    Staraj się wyjaśniać koncepcje w sposób zrozumiały.`;

export const POST: RequestHandler = async ({ request }) => {
	try {
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
						controller.enqueue(content);
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
		console.error('OpenAI API error:', error);
		return json({ error: 'Wystąpił błąd podczas generowania odpowiedzi.' }, { status: 500 });
	}
};
