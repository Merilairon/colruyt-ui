<script lang="ts">
	import { Button, Label, Select } from 'flowbite-svelte';
	import promotions from '../../stores/promotions';
	import { onMount } from 'svelte';
	import PromotionCard from '$lib/components/PromotionCard.svelte';
	import { _, locale, locales } from 'svelte-i18n';
	import Pagination from '$lib/components/Pagination.svelte';
	import StateDisplay from '$lib/components/StateDisplay.svelte';

	let pageSize = 60;
	let helper = $state({ page: 1, total: 100 });
	let filteredPromotions = $state($promotions);
	let selectedSortOption = $state('desc');
	let sortOptions = [
		{ value: 'asc', name: 'Ascending' },
		{ value: 'desc', name: 'Descending' }
	];
	let doneFetching = $state(false);

	let paginationData = $derived(() => {
		const totalPages = Math.ceil(helper.total / pageSize);
		const pages = Array.from({ length: totalPages }, (_, i) => ({
			name: (i + 1).toString(),
			href: `/promotions?page=${i + 1}`
		}));
		return {
			currentPage: helper.page,
			totalPages: totalPages,
			pages: pages
		};
	});

	let paginationStatus = $derived(() => {
		const start = pageSize * (helper.page - 1) + 1;
		const end = Math.min(start + pageSize - 1, helper.total);
		return { start, end, total: helper.total };
	});

	onMount(async () => {
		await fetchPromotions(helper.page);
	});

	async function fetchPromotions(page: number) {
		try {
			doneFetching = false;
			const response = await fetch(
				`https://colruyt.merilairon.com/api/promotions?page=${page}&size=${pageSize}&sort=${selectedSortOption}`
			);
			const data = await response.json();
			helper.total = data.total;
			promotions.set(data.promotions);
			filteredPromotions = $promotions;
		} catch (error) {
			console.log(error);
		}
		doneFetching = true;
	}

	const handlePageChange = (pageNr: number) => {
		helper.page = pageNr;
		fetchPromotions(helper.page);
	};

	const sortPromotions = async () => {
		await fetchPromotions(helper.page);
	};

	const resetSort = async () => {
		selectedSortOption = 'desc';
		await sortPromotions();
	};
</script>

<div class="mb-5 flex w-80 justify-center">
	<Label class="mr-2 w-60 ">
		Sort: <Select
			onchange={sortPromotions}
			class="mt-2"
			items={sortOptions}
			bind:value={selectedSortOption}
		/>
	</Label>
	<div class="resetBtn">
		<Button class="mt-7 w-20 cursor-pointer" onclick={resetSort}>Reset</Button>
	</div>
</div>

<StateDisplay 
    loading={!doneFetching} 
    empty={filteredPromotions.length === 0 && doneFetching} 
    emptyText="No promotions found" 
/>

{#if filteredPromotions.length > 0}
	<div class="mb-4 flex flex-col items-center justify-center gap-2">
		<div class="text-sm text-gray-700 dark:text-gray-400">
			{$_('pagination.showing')}
			<span class="font-semibold text-gray-900 dark:text-white">{paginationStatus.start}</span>
			{$_('pagination.to')}
			<span class="font-semibold text-gray-900 dark:text-white">{paginationStatus.end}</span>
			{$_('pagination.of')}
			<span class="font-semibold text-gray-900 dark:text-white">{paginationStatus.total}</span>
			{$_('pagination.entries')}
		</div>
	</div>

	<div
		class="grid grid-flow-row auto-rows-max gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
	>
		{#each filteredPromotions as promotion, index}
			<PromotionCard {promotion} />
		{/each}
	</div>
	<Pagination pages={paginationData} onPageChange={handlePageChange} />
{/if}
