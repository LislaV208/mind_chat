<!-- Komponent wyświetlający historię konwersacji -->
<script lang="ts">
	import { chatStore } from './chat.store';

	$: chats = $chatStore.chats;
	$: currentChat = $chatStore.currentChat;

	function formatDate(date: Date): string {
		return new Date(date).toLocaleString('pl-PL', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function handleConversationSelect(id: string) {
		chatStore.onChatSelected(id);
	}

	function handleNewConversation() {
		chatStore.createChat('Nowa konwersacja');
	}
</script>

<div class="h-full flex flex-col min-h-0">
	<div class="p-4">
		<div class="flex justify-between items-center">
			<h2 class="text-xl font-bold">Historia konwersacji</h2>
			<button
				class="p-2 rounded-lg hover:bg-surface-500/20"
				on:click={handleNewConversation}
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
	</div>

	<div class="flex-1 overflow-y-auto px-4">
		{#if chats.length === 0}
			<div class="flex items-center justify-center text-surface-400 h-32">
				<span>Brak historii konwersacji</span>
			</div>
		{:else}
			<div class="space-y-2 pb-4">
				{#each chats as chat}
					<button
						class="w-full p-3 rounded-lg text-left transition-colors group relative
							{currentChat?.id === chat.id ? 'bg-surface-400/20' : ''}"
						on:click={() => handleConversationSelect(chat.id)}
					>
						<div class="flex justify-between items-center">
							<div class="font-medium line-clamp-1">{chat.title}</div>
							<button
								class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-error-500/20 hover:text-error-500"
								on:click|stopPropagation={() => chatStore.deleteChat(chat.id)}
								title="Usuń konwersację"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-4 h-4"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
									/>
								</svg>
							</button>
						</div>
						<!-- {#if conversation.lastMessage}
							<div class="text-sm text-surface-400 line-clamp-2 mt-1">
								{conversation.lastMessage}
							</div>
						{/if} -->
						<div class="text-xs text-surface-400 mt-1">
							{formatDate(chat.updatedAt)}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
