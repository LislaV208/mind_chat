<!-- Lista wiadomości w chacie -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { chatStore } from './chat.store';
	import type { ChatMessage } from './domain/models/message.model';
	import { afterUpdate } from 'svelte';

	let elemChat: HTMLDivElement;

	$: messages = $chatStore.messages;
	$: error = $chatStore.error;
	$: status = $chatStore.status;

	afterUpdate(() => {
		if (elemChat && messages.length > 0) {
			elemChat.scrollTop = elemChat.scrollHeight;
		}
	});

	function formatMessage(content: string, role: ChatMessage['role']): string {
		if (role === 'assistant') {
			const html = marked.parse(content, { async: false }) as string;
			return DOMPurify.sanitize(html);
		}
		return content;
	}
</script>

<div class="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6" bind:this={elemChat}>
	<section class="w-full py-4 space-y-4" class:h-full={messages.length === 0}>
		{#if messages.length === 0}
			<div
				class="flex flex-col items-center justify-center text-center space-y-4"
				class:h-full={messages.length === 0}
			>
				<h2 class="h2">Witaj w Mind Chat! 👋</h2>
				<p class="text-surface-300">
					Zadaj mi dowolne pytanie, a pomogę Ci się uczyć i zrozumieć nowe tematy.
				</p>
				<p class="text-surface-300">W trakcie naszej rozmowy będę budować mapę Twojej wiedzy.</p>
			</div>
		{/if}

		{#each messages as message (message.id)}
			<div class="flex flex-col" class:items-end={message.role === 'user'} transition:fade>
				<div
					class="max-w-[85%] sm:max-w-[75%]"
					class:variant-soft-primary={message.role === 'user'}
					class:rounded-lg={message.role === 'user'}
					class:p-3={message.role === 'user'}
				>
					{#if message.role === 'assistant'}
						<div class="prose dark:prose-invert max-w-none">
							{@html formatMessage(message.content, message.role)}
						</div>
					{:else}
						{formatMessage(message.content, message.role)}
					{/if}
				</div>
			</div>
		{/each}

		{#if error}
			<div class="w-full p-4">
				<div class="card p-4 variant-filled-error">
					{error}
				</div>
			</div>
		{/if}
	</section>
</div>
