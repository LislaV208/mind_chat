<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import { format } from 'date-fns';
	import { pl } from 'date-fns/locale';

	let messageFeed = [
		{
			id: 0,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: 'Yesterday @ 2:30pm',
			message: 'Some message text.',
			color: 'variant-soft-primary'
		},
		{
			id: 1,
			host: false,
			avatar: 14,
			name: 'Michael',
			timestamp: 'Yesterday @ 2:45pm',
			message: 'Some message text.',
			color: 'variant-soft-primary'
		}
	];

	let currentMessage = '';
	let elemChat: HTMLElement;

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function addMessage(): void {
		const newMessage = {
			id: messageFeed.length,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: format(new Date(), "'Dzisiaj @' HH:mm", { locale: pl }),
			message: currentMessage,
			color: 'variant-soft-primary'
		};
		// Append the new message to the message feed
		messageFeed = [...messageFeed, newMessage];
		// Clear the textarea message
		currentMessage = '';
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
		<header class="border-b border-surface-500/30 p-4">
			<input class="input" type="search" placeholder="Search..." />
		</header>
		<!-- List -->
		<div class="p-4 space-y-4 overflow-y-auto">
			<small class="opacity-50">Contacts</small>
			<div class="flex flex-col space-y-1">
				<button type="button" class="btn w-full flex items-center space-x-4 bg-surface-hover-token">
					<!-- <Avatar src="https://i.pravatar.cc/?img=14" width="w-8" /> -->
					<div class="w-8 h-8 rounded-full bg-tertiary-500 flex items-center justify-center">
						<span class="text-white">LP</span>
					</div>
					<span class="flex-1 text-start"> Leon Pietrzak </span>
				</button>
			</div>
		</div>
	</div>
	<!-- Chat -->
	<div class="h-full flex flex-col flex-1 min-h-0 w-[1000px] mx-auto">
		<!-- Message feed -->
		<div class="flex-1 overflow-y-auto p-4 border-b border-surface-500/30" bind:this={elemChat}>
			<!-- Placeholder for scrolling -->
			<section class="w-full p-4 space-y-4">
				{#each messageFeed as bubble, i}
					{#if bubble.host === true}
						<!-- Host message -->
						<div class="grid grid-cols-[auto_1fr] gap-2">
							<Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
							<div class="card p-4 variant-soft rounded-xl space-y-2">
								<header class="flex justify-between items-center">
									<p class="font-bold">{bubble.name}</p>
									<small class="opacity-50">{bubble.timestamp}</small>
								</header>
								<p>{bubble.message}</p>
							</div>
						</div>
					{:else}
						<!-- Guest message -->
						<div class="grid grid-cols-[1fr_auto] gap-2">
							<div class="card p-4 rounded-xl space-y-2 {bubble.color}">
								<header class="flex justify-between items-center">
									<p class="font-bold">{bubble.name}</p>
									<small class="opacity-50">{bubble.timestamp}</small>
								</header>
								<p>{bubble.message}</p>
							</div>
							<Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
						</div>
					{/if}
				{/each}
			</section>
		</div>
		<!-- Input -->
		<div class="p-4">
			<div class="bg-surface-500/30 rounded-xl p-2">
				<textarea
					bind:value={currentMessage}
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
