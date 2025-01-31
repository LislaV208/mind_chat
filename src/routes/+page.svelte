<script lang="ts">
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { navigationStore, toggleNavigation } from '$lib/navigation/store';
	import { chatStore } from '$lib/chat/store';
	import { historyStore } from '$lib/chat/history.store';
	import ConversationHistory from '$lib/chat/components/ConversationHistory.svelte';

	$: activeConversation = $historyStore.activeConversationId
		? $historyStore.conversations.find((c) => c.id === $historyStore.activeConversationId)
		: null;
	$: messages = activeConversation?.messages ?? [];
	$: status = $chatStore.status;
	$: error = $chatStore.error;
	$: isNavigationOpen = $navigationStore.isOpen;

	let inputContent = '';
	let elemChat: HTMLElement;
	let textareaElement: HTMLTextAreaElement;

	$: if (status === 'idle') {
		setTimeout(() => {
			textareaElement?.focus();
		}, 0);
	}

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat?.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function startNewConversation(): void {
		historyStore.createConversation();
	}

	function loadConversation(conversationId: string): void {
		historyStore.setActiveConversation(conversationId);
		scrollChatBottom();
	}

	async function addMessage(): Promise<void> {
		if (!inputContent.trim()) return;

		// Jeśli nie ma aktywnej konwersacji, utwórz nową
		if (!activeConversation) {
			historyStore.createConversation();
		}

		const content = inputContent;
		inputContent = '';

		try {
			// Wysyłamy wiadomość użytkownika
			const userMessage = chatStore.createMessage('user', content);
			historyStore.addMessage(userMessage);

			// Wysyłamy do API i otrzymujemy odpowiedź asystenta
			const assistantMessage = await chatStore.sendMessage(content);
			if (assistantMessage) {
				historyStore.addMessage(assistantMessage);
			}

			// Przewijamy do najnowszej wiadomości
			scrollChatBottom();
		} catch (error) {
			console.error('Error:', error);
		}
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
		class="fixed inset-0 lg:static transition-transform duration-300 ease-in-out transform
		{isNavigationOpen ? 'translate-x-0' : '-translate-x-full'} 
		lg:translate-x-0 bg-surface-100-800-token lg:bg-transparent
		min-w[250px] w-[80vw] max-w-[320px] md:max-w-[400px] lg:w-auto h-full
		z-40 lg:z-auto flex flex-col min-h-0
		border-r border-surface-400/40"
	>
		<ConversationHistory
			currentConversationId={$historyStore.activeConversationId}
			onConversationSelect={loadConversation}
			onNewConversation={startNewConversation}
		/>
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

					{#each messages as message}
						{#if message.role === 'user'}
							<!-- User message -->
							<div class="w-fit ml-auto">
								<div class="card p-4 rounded-lg space-y-2 variant-soft-primary">
									<p>{message.content}</p>
								</div>
							</div>
						{:else}
							<!-- Assistant message -->
							<div class="w-full max-w-3xl mx-auto">
								<div class="p-4 space-y-2">
									<div class="prose dark:prose-invert max-w-none">
										{@html formatMessage(message.content, message.role)}
									</div>
								</div>
							</div>
						{/if}
					{/each}

					{#if status === 'waiting' || status === 'streaming'}
						<div class="w-full flex items-center justify-center p-4">
							<ProgressRadial width="w-8" />
						</div>
					{/if}

					{#if error}
						<div class="w-full p-4">
							<div class="card p-4 variant-filled-error">
								{error}
							</div>
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
