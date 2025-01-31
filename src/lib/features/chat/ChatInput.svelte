<!-- Input do wpisywania wiadomości -->
<script lang="ts">
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { chatStore } from './chat.store';
    import type { ChatState } from './types';

    let inputContent = '';
    let textareaElement: HTMLTextAreaElement;

    $: status = $chatStore.status;

    $: if (status === 'idle') {
        setTimeout(() => {
            textareaElement?.focus();
        }, 0);
    }

    function handleSubmit(): void {
        if (!inputContent.trim()) return;
        chatStore.sendMessage(inputContent);
        inputContent = '';
    }

    function onPromptKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    }
</script>

<div class="p-4 border-t border-surface-400/40">
    <div class="max-w-3xl mx-auto">
        <div class="card p-2 variant-filled-surface !bg-surface-400/20 relative">
            <textarea
                bind:this={textareaElement}
                bind:value={inputContent}
                disabled={status !== 'idle'}
                class="bg-transparent border-0 ring-0 w-full focus:ring-0 focus:border-0 resize-none pr-12"
                name="prompt"
                id="prompt"
                placeholder="Zadaj pytanie..."
                on:keydown={onPromptKeydown}
                rows="1"
            />

            <div class="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                    class="btn-icon variant-filled"
                    class:variant-filled-primary={inputContent.trim()}
                    class:variant-filled-surface={!inputContent.trim()}
                    disabled={status !== 'idle' || !inputContent.trim()}
                    on:click={handleSubmit}
                >
                    {#if status === 'loading' || status === 'streaming'}
                        <ProgressRadial width="w-6" stroke={100} meter="stroke-primary-500" track="stroke-primary-500/30" />
                    {:else}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-5 h-5"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                            />
                        </svg>
                    {/if}
                </button>
            </div>
        </div>
    </div>
</div>
