<script lang="ts">
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';
	import { format } from 'date-fns';
	import { pl } from 'date-fns/locale';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	import { chatStore } from '$lib/chat/store';
	import type { Message } from '$lib/chat/types/message';

	$: messages = $chatStore.messages;
	$: status = $chatStore.status;
	$: error = $chatStore.error;

	let inputContent = '';
	let elemChat: HTMLElement;

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat?.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function addMessage(): void {
		chatStore.onMessageSent(inputContent);
		inputContent = '';
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}

	function formatMessage(content: string, role: 'user' | 'assistant'): string {
		if (role === 'assistant') {
			return marked.parse(content, { async: false }) as string;
		}
		return content;
	}

	onMount(() => {
		chatStore.setOnUpdate(() => {
			scrollChatBottom('smooth');
		});
	});
</script>

<div class="h-screen grid grid-cols-1 lg:grid-cols-[600px_1fr] bg-surface-400/20">
	<!-- Navigation -->
	<div class="hidden lg:grid grid-rows-[auto_1fr] border-r border-surface-400/40"></div>
	<!-- Chat -->
	<div class="h-full flex flex-col flex-1 min-h-0 w-[1000px] mx-auto">
		<!-- Message feed -->
		<div class="flex-1 overflow-y-auto p-4" bind:this={elemChat}>
			<!-- Placeholder for scrolling -->
			<section class="w-full p-4 space-y-4">
				{#each messages as message, i}
					{#if message.role === 'user'}
						<!-- User message -->
						<div class="w-fit ml-auto">
							<div class="card p-4 rounded-lg space-y-2 variant-soft-primary">
								<p>{message.content}</p>
							</div>
						</div>
					{:else}
						<div class="w-full max-w-3xl mx-auto">
							<div class="p-4 space-y-2">
								<div class="prose dark:prose-invert max-w-none">
									{@html formatMessage(message.content, message.role)}
								</div>
							</div>
						</div>
					{/if}
				{/each}

				{#if status === 'waiting'}
					<div class="w-full flex items-center justify-center p-4">
						<ProgressRadial width="w-8" />
					</div>
				{/if}
			</section>
		</div>
		<!-- Input -->
		<div class="p-4 border-t border-surface-400/40">
			<div class="max-w-3xl mx-auto">
				<div class="card p-2 variant-filled-surface !bg-surface-400/20">
					<textarea
						bind:value={inputContent}
						disabled={status !== 'idle'}
						class="bg-transparent border-0 ring-0 w-full focus:ring-0 focus:border-0 resize-none"
						name="prompt"
						id="prompt"
						placeholder="Write a message..."
						on:keydown={onPromptKeydown}
						rows="1"
					/>
				</div>
			</div>
		</div>
	</div>
</div>
