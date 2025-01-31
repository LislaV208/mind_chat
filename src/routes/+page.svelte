<script lang="ts">
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { navigationStore, toggleNavigation } from '$lib/navigation/store';
	import { chatStore } from '$lib/chat/store';
	import { historyStore } from '$lib/chat/history.store';

	$: messages = $chatStore.messages;
	$: status = $chatStore.status;
	$: error = $chatStore.error;
	$: isNavigationOpen = $navigationStore.isOpen;
	$: history = $historyStore;
	$: conversations = history.conversations;

	let inputContent = '';
	let elemChat: HTMLElement;
	let textareaElement: HTMLTextAreaElement;
	let currentConversationId: string | null = null;

	$: if ($chatStore.status === 'idle') {
		setTimeout(() => {
			textareaElement?.focus();
		}, 0);
	}

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat?.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function startNewConversation(): void {
		currentConversationId = null;
		chatStore.clearMessages();
	}

	function loadConversation(conversationId: string): void {
		const conversation = historyStore.getConversation(conversationId);
		if (conversation) {
			currentConversationId = conversationId;
			chatStore.setMessages(conversation.messages);
			scrollChatBottom();
		}
	}

	function addMessage(): void {
		const message = {
			id: messages.length + 1,
			role: 'user' as const,
			content: inputContent,
			timestamp: new Date()
		};

		if (!currentConversationId) {
			const conversation = historyStore.createConversation(message);
			currentConversationId = conversation.id;
		} else {
			historyStore.updateConversation(currentConversationId, message);
		}

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

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('pl-PL', {
			day: '2-digit',
			month: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}

	onMount(() => {
		chatStore.setOnUpdate(() => {
			scrollChatBottom('smooth');
			// Aktualizuj historię gdy otrzymamy odpowiedź od asystenta
			if (currentConversationId && messages.length > 0) {
				const lastMessage = messages[messages.length - 1];
				if (lastMessage.role === 'assistant') {
					historyStore.updateConversation(currentConversationId, lastMessage);
				}
			}
		});
	});
</script>

<div class="h-screen grid grid-cols-1 lg:grid-cols-[500px_1fr] bg-surface-400/20">
	<!-- Navigation button (visible only on small screens) -->
	<button
		class="fixed top-4 left-4 z-50 p-2 lg:hidden rounded-full hover:bg-surface-500/20"
		on:click={toggleNavigation}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
			/>
		</svg>
	</button>

	<!-- Navigation -->
	<div
		class="fixed inset-0 lg:relative lg:inset-auto transition-transform duration-300 ease-in-out transform
		{isNavigationOpen ? 'translate-x-0' : '-translate-x-full'} 
		lg:translate-x-0 bg-surface-100-800-token lg:bg-transparent
		min-w-[250px] w-[80vw] max-w-[320px] md:max-w-[400px] lg:w-auto
		z-40 lg:z-auto
		border-r border-surface-400/40"
	>
		<div class="p-4 h-full overflow-y-auto">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-bold">Historia konwersacji</h2>
				<button
					class="p-2 rounded-lg hover:bg-surface-500/20"
					on:click={startNewConversation}
					title="Nowa konwersacja"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
				</button>
			</div>

			{#if conversations.length === 0}
				<div class="flex items-center justify-center text-surface-400 h-32">
					<span>Brak historii konwersacji</span>
				</div>
			{:else}
				<div class="space-y-2">
					{#each conversations as conversation}
						<button
							class="w-full p-3 rounded-lg hover:bg-surface-500/20 text-left transition-colors
								{currentConversationId === conversation.id ? 'bg-surface-500/20' : ''}"
							on:click={() => loadConversation(conversation.id)}
						>
							<div class="font-medium line-clamp-1">{conversation.title}</div>
							<div class="text-sm text-surface-400 line-clamp-2 mt-1">
								{conversation.lastMessage}
							</div>
							<div class="text-xs text-surface-400 mt-1">
								{formatDate(conversation.updatedAt)}
							</div>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Overlay for mobile navigation -->
	{#if isNavigationOpen}
		<button
			type="button"
			class="fixed inset-0 bg-black/50 z-30 lg:hidden w-full h-full border-0"
			on:click={toggleNavigation}
			on:keydown={(e) => e.key === 'Escape' && toggleNavigation()}
			aria-label="Zamknij menu"
			transition:fade
		/>
	{/if}

	<!-- Chat -->
	<div class="h-full flex flex-col flex-1 min-h-0 relative">
		<div
			class="w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-3xl mx-auto h-full flex flex-col"
		>
			<!-- Message feed -->
			<div class="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6" bind:this={elemChat}>
				<!-- Placeholder for scrolling -->
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
							<p class="text-surface-300">
								W trakcie naszej rozmowy będę budować mapę Twojej wiedzy.
							</p>
						</div>
					{/if}
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
							bind:this={textareaElement}
							bind:value={inputContent}
							disabled={status !== 'idle'}
							class="bg-transparent border-0 ring-0 w-full focus:ring-0 focus:border-0 resize-none"
							name="prompt"
							id="prompt"
							placeholder="Zadaj pytanie..."
							on:keydown={onPromptKeydown}
							rows="1"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
