<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		Label,
		Pagination,
		PaginationItem,
		PaginationNav,
		Select,
		Spinner
	} from 'flowbite-svelte';
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
	import promotions from '../../stores/promotions';
	import { onMount } from 'svelte';
	import PromotionCard from '$lib/components/PromotionCard.svelte';
	import { _, locale, locales } from 'svelte-i18n';

	let pageSize = 60;
	let helper = $state({ start: 1, end: pageSize, page: 1, total: 100 });
	let filteredPromotions = $state($promotions);
	let selectedSortOption = $state('desc');
	let sortOptions = [
		{ value: 'asc', name: 'Ascending' },
		{ value: 'desc', name: 'Descending' }
	];

	//TODO: add infinite scroll or something
	onMount(async () => {
		await fetchPromotions(helper.page);
	});

	async function fetchPromotions(page: number) {
		try {
			const response = await fetch(
				`https://colruyt.merilairon.com/api/promotions?page=${page}&size=${pageSize}&order=
				
				&sort=${selectedSortOption}`
			);
			const data = await response.json();
			helper.total = data.total;
			promotions.set(data.promotions);
			filteredPromotions = $promotions;
		} catch (error) {
			console.log(error);
		}
	}

	const handlePageChange = (pageNr: number) => {
		helper.page = pageNr;

		helper.start = pageSize * (helper.page - 1) + 1;
		helper.end = helper.start + pageSize - 1;

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
{#if $promotions.length === 0}
	<div class="loading-state animate-pulse">
		<div class="text-center">
			<Spinner />
		</div>
	</div>
{:else}
	<div class="mb-4 flex flex-col items-center justify-center gap-2">
		<div class="text-sm text-gray-700 dark:text-gray-400">
			{$_('pagination.showing')}
			<span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span>
			{$_('pagination.to')}
			<span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
			{$_('pagination.of')}
			<span class="font-semibold text-gray-900 dark:text-white">{helper.total}</span>
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
	<div class="mb-4 flex flex-col items-center justify-center gap-2">
		<div class="text-sm text-gray-700 dark:text-gray-400">
			{$_('pagination.showing')}
			<span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span>
			{$_('pagination.to')}
			<span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
			{$_('pagination.of')}
			<span class="font-semibold text-gray-900 dark:text-white">{helper.total}</span>
			{$_('pagination.entries')}
		</div>

		<PaginationNav
			currentPage={helper.page}
			onPageChange={handlePageChange}
			totalPages={Math.ceil(helper.total / pageSize)}
			table
			size="large"
		>
			{#snippet prevContent()}
				<span class="sr-only">Previous</span>
				<ArrowLeftOutline class="h-5 w-5" />
			{/snippet}
			{#snippet nextContent()}
				<span class="sr-only">Next</span>
				<ArrowRightOutline class="h-5 w-5" />
			{/snippet}
		</PaginationNav>
	</div>
{/if}

<style>
	.loading-state {
		display: grid;
		place-items: center;
		min-height: 200px;
	}
</style>
