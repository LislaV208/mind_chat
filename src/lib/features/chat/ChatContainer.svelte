<script lang="ts">
	import { fade } from 'svelte/transition';

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

<div class="h-full flex flex-col flex-1 min-h-0 relative">
	<div
		class="w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-3xl mx-auto h-full flex flex-col"
	>
		<ChatMessages />
		<ChatInput />
	</div>
</div>
