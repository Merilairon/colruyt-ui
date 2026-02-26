<script lang="ts">
    import { Spinner } from 'flowbite-svelte';

    let { empty, emptyText, loading, loadingText } = $props();
</script>

{#if loading}
    <div class="loading-state animate-pulse">
        <div class="text-center">
            <Spinner />
            {#if loadingText}
                <p class="mt-2 text-center text-gray-900 dark:text-white">{loadingText}</p>
            {/if}
        </div>
    </div>
{:else if empty}
    <div class="loading-state">
        <div class="text-center text-gray-900 dark:text-white">
            {emptyText}
        </div>
    </div>
{/if}

<style>
	.loading-state {
		display: grid;
		place-items: center;
		min-height: 200px;
	}
</style>
