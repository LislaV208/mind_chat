<script lang="ts">
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';
	import { format } from 'date-fns';
	import { pl } from 'date-fns/locale';

	import { chatStore } from '$lib/chat/store';
	import type { Message } from '$lib/chat/types/message';

	$: messages = $chatStore.messages;
	$: status = $chatStore.status;
	$: error = $chatStore.error;

	let inputContent = '';

	let elemChat: HTMLElement;

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function addMessage(): void {
		chatStore.onMessageSent(inputContent);

		// Clear the textarea message
		inputContent = '';
		// Smoothly scroll to the bottom of the feed
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}
</script>

<div class="h-screen grid grid-cols-1 lg:grid-cols-[600px_1fr]">
	<!-- Navigation -->
	<div class="hidden lg:grid grid-rows-[auto_1fr] border-r border-surface-500/30">
		<!-- Header -->
		<!-- <header class="border-b border-surface-500/30 p-4">
			<input class="input" type="search" placeholder="Search..." />
		</header> -->
		<!-- List -->
		<!-- <div class="p-4 space-y-4 overflow-y-auto">
			<small class="opacity-50">Contacts</small>
			<div class="flex flex-col space-y-1">
				<button type="button" class="btn w-full flex items-center space-x-4 bg-surface-hover-token">
					
					<div class="w-8 h-8 rounded-full bg-tertiary-500 flex items-center justify-center">
						<span class="text-white">LP</span>
					</div>
					<span class="flex-1 text-start"> Leon Pietrzak </span>
				</button>
			</div>
		</div> -->
	</div>
	<!-- Chat -->
	<div class="h-full flex flex-col flex-1 min-h-0 w-[1000px] mx-auto">
		<!-- Message feed -->
		<div class="flex-1 overflow-y-auto p-4 border-b border-surface-500/30" bind:this={elemChat}>
			<!-- Placeholder for scrolling -->
			<section class="w-full p-4 space-y-4">
				{#each messages as message, i}
					{#if message.role === 'user'}
						<!-- User message -->

						<div class="w-fit ml-auto">
							<div class="card p-4 variant-soft-primary rounded-xl space-y-2">
								<p>{message.content}</p>
							</div>
						</div>
					{:else}
						<div class="grid grid-cols-[auto_1fr] gap-2">
							<div class="card p-4 rounded-xl space-y-2 variant-soft">
								<p>{message.content}</p>
							</div>
						</div>
					{/if}
				{/each}

				{#if status === 'loading'}
					<div class="w-full flex items-center justify-center">
						<ProgressRadial width="w-10" />
					</div>
				{/if}
			</section>
		</div>
		<!-- Input -->
		<div class="p-4">
			<div class="bg-surface-500/30 rounded-xl p-2">
				<textarea
					bind:value={inputContent}
					disabled={status === 'loading'}
					class="bg-transparent border-0 ring-0 w-full focus:ring-0 focus:border-0 resize-none"
					name="prompt"
					id="prompt"
					placeholder="Write a message..."
					rows="3"
					on:keydown={onPromptKeydown}
				/>
			</div>
		</div>
	</div>
</div>
