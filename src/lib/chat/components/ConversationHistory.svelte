<script lang="ts">
	import { fade } from 'svelte/transition';
	import { historyStore } from '../history.store';

	export let currentConversationId: string | null = null;
	export let onConversationSelect: (id: string) => void;
	export let onNewConversation: () => void;

	$: history = $historyStore;
	$: conversations = history.conversations;

	function handleConversationSelect(id: string): void {
		onConversationSelect(id);
	}

	function handleNewConversation(): void {
		onNewConversation();
	}

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('pl-PL', {
			day: '2-digit',
			month: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	}
</script>

<div class="p-4 h-full overflow-y-auto">
	<div class="flex justify-between items-center mb-4">
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
					on:click={() => handleConversationSelect(conversation.id)}
				>
					<div class="font-medium line-clamp-1">{conversation.title}</div>
					{#if conversation.lastMessage}
						<div class="text-sm text-surface-400 line-clamp-2 mt-1">
							{conversation.lastMessage}
						</div>
					{/if}
					<div class="text-xs text-surface-400 mt-1">
						{formatDate(conversation.updatedAt)}
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>
