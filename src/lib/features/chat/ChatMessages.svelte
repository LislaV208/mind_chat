<!-- Lista wiadomości w chacie -->
<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import { fade } from 'svelte/transition';
    import { marked } from 'marked';
    import type { ChatMessage } from './types';

    export let messages: ChatMessage[] = [];
    export let error: string | null = null;
    export let elemChat: HTMLElement;

    function formatMessage(content: string, role: 'user' | 'assistant'): string {
        if (role === 'assistant') {
            return marked.parse(content, { async: false }) as string;
        }
        return content;
    }
</script>

<div class="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6" bind:this={elemChat}>
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

        {#each messages as message (message.id)}
            <div
                class="flex items-start gap-2 sm:gap-4"
                class:justify-end={message.role === 'user'}
                transition:fade
            >
                {#if message.role === 'assistant'}
                    <Avatar initials="AI" />
                {/if}

                <div
                    class="rounded-lg p-3 max-w-[85%] sm:max-w-[75%]"
                    class:variant-soft={message.role === 'user'}
                    class:variant-ghost={message.role === 'assistant'}
                >
                    {#if message.role === 'assistant'}
                        <div class="prose dark:prose-invert max-w-none">
                            {@html formatMessage(message.content, message.role)}
                        </div>
                    {:else}
                        {formatMessage(message.content, message.role)}
                    {/if}
                </div>

                {#if message.role === 'user'}
                    <Avatar initials="U" />
                {/if}
            </div>
        {/each}

        {#if error}
            <div class="w-full p-4">
                <div class="card p-4 variant-filled-error">
                    {error}
                </div>
            </div>
        {/if}
    </section>
</div>
