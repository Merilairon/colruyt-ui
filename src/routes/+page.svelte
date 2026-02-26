
<script lang="ts">
	import { Button,ButtonGroup } from 'flowbite-svelte';
	import ProductsOverview from '$lib/components/ProductsOverview.svelte';
	import filters from '../stores/filters';
    import FilterManagerPopup from '$lib/components/FilterManagerPopup.svelte';
	import FilterPopup from '$lib/components/FilterPopup.svelte';
	import { CogOutline, PlusOutline } from 'flowbite-svelte-icons';

	let activeFilter = $state(0);
    let formModal = $state(false);
	let managerModal = $state(false);

    const openFormModal = () => (formModal = true);
	const openManagerModal = () => (managerModal = true);

</script>

<svelte:head>
	<title>Colruyt promotions</title>
	<meta name="description" content="An overview of all the promotions at Colruyt" />
</svelte:head>

<FilterPopup bind:formModal />
<FilterManagerPopup bind:managerModal />

<div class="mb-4 flex flex-col items-end justify-center gap-2">
    <ButtonGroup>
        <Button on:click={openFormModal}>
            <PlusOutline class="me-2 h-3 w-3" />
            Add new filter</Button>
        <Button on:click={openManagerModal}>
            <CogOutline class="me-2 h-3 w-3" />
            Manage filters</Button>
    </ButtonGroup>
</div>

<div class="mb-4 flex flex-col items-center justify-center gap-2">
    <ButtonGroup>
        {#each $filters as filter, index}
            <Button
                color={activeFilter === index ? 'blue' : 'light'}
                on:click={() => (activeFilter = index)}>{filter.filterName}</Button
            >
        {/each}
    </ButtonGroup>
</div>

<ProductsOverview
	fromPercentage={$filters[activeFilter].fromPercentage}
	toPercentage={$filters[activeFilter].toPercentage}
	category={$filters[activeFilter].category}
/>
