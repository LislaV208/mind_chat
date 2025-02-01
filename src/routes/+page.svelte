<script lang="ts">
	import { fade } from 'svelte/transition';
	import ChatContainer from '$lib/features/chat/ChatContainer.svelte';
	import ConversationHistory from '$lib/features/conversation/ConversationHistory.svelte';
	import { conversationStore } from '$lib/features/conversation/conversation.store';
	import ChatMessages from '$lib/features/chat/ChatMessages.svelte';
	import ChatInput from '$lib/features/chat/ChatInput.svelte';
	import Navigation from '$lib/features/navigation/Navigation.svelte';
	import { navigationStore, toggleNavigation } from '$lib/features/navigation/navigation.store';

	$: activeConversation = $conversationStore.activeConversationId
		? $conversationStore.conversations.find((c) => c.id === $conversationStore.activeConversationId)
		: null;
	$: isNavigationOpen = $navigationStore.isOpen;

	function startNewConversation(): void {
		conversationStore.createConversation();
	}

	function loadConversation(conversationId: string): void {
		conversationStore.setActiveConversation(conversationId);
	}
</script>

<div class="h-screen grid grid-cols-1 lg:grid-cols-[500px_1fr] bg-surface-400/20">
	<!-- Navigation button -->
	<Navigation onToggle={toggleNavigation} />

	<!-- Sidebar -->
	<div
		class="fixed inset-0 lg:static transition-transform duration-300 ease-in-out transform
		{isNavigationOpen ? 'translate-x-0' : '-translate-x-full'} 
		lg:translate-x-0 bg-surface-100-800-token lg:bg-transparent
		min-w[250px] w-[80vw] max-w-[320px] md:max-w-[400px] lg:w-auto h-full
		z-40 lg:z-auto flex flex-col min-h-0
		border-r border-surface-400/40"
	>
		<ConversationHistory
			currentConversationId={$conversationStore.activeConversationId}
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

	<ChatContainer></ChatContainer>
</div>
