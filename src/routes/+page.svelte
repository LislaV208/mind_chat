<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="min-h-screen container mx-auto flex justify-center items-center">
	<div class="card p-8 space-y-6 text-center">
		<h1 class="h1">Mind Map Chat</h1>
		<p class="text-lg">
			Witaj w Mind Map Chat! Rozpocznij rozmowę z AI i twórz własną mapę wiedzy podczas nauki.
		</p>
		<button class="btn variant-filled-primary" on:click={() => goto('/chat')}>
			Rozpocznij rozmowę
		</button>
	</div>
</div>
