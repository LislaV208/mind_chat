<script lang="ts">
	import ChatMessages from '$lib/features/chat/ChatMessages.svelte';
	import ChatInput from '$lib/features/chat/ChatInput.svelte';
</script>

<div class="h-full flex flex-col flex-1 min-h-0 relative">
	<div
		class="w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-3xl mx-auto h-full flex flex-col"
	>
		<ChatMessages />
		<ChatInput />
	</div>
</div>
