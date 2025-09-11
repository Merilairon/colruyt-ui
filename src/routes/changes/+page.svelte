<script lang="ts">
	import { AccordionItem, Accordion, Spinner, Button } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import filters from '../../stores/filters';
	import FilterPopup from '$lib/components/FilterPopup.svelte';
	import ProductsOverview from '$lib/components/ProductsOverview.svelte';

	let formModal = $state(false);

	const addFilter = () => (formModal = true);

	$effect(() => {});
</script>

<Accordion flush class="pb-4">
	{#each $filters as filter, index}
		<AccordionItem>
			{#snippet header()}
				{filter.filterName}
			{/snippet}
			<ProductsOverview fromPercentage={filter.fromPercentage} toPercentage={filter.toPercentage} />
		</AccordionItem>
	{/each}
</Accordion>
<div class="flex flex-col items-center justify-center">
	<Button color="light" aria-label="Go back" class="mb-4 cursor-pointer" onclick={addFilter}>
		<PlusOutline class="ms-2 h-5 w-5" />
		Add new change filter
	</Button>
</div>

<FilterPopup bind:formModal />
