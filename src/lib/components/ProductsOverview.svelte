<script lang="ts">
	import { page } from '$app/state';
	import { PaginationNav, Search, Spinner } from 'flowbite-svelte';
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
	import products from '../../stores/products';
	import { onMount } from 'svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { replaceState } from '$app/navigation';
	import { _, locale, locales } from 'svelte-i18n';

	let { fromPercentage = $bindable(), toPercentage = $bindable() } = $props();

	// svelte-ignore non_reactive_update
	let pageSize = 60;
	let helper = $state({ start: 1, end: pageSize, page: 1, total: 100 });

	onMount(async () => {
		await fetchProducts(helper.page);
	});

	function fetchProducts(page: number) {
		fetch(
			`${'https://colruyt.merilairon.com/api'}/products/changes?&page=${page}&size=${pageSize}&fromPerc=${fromPercentage || -1000}&toPerc=${toPercentage || 0}`
		)
			.then((response) => response.json())
			.then((data) => {
				helper.total = data.total;
				if (pageSize > data.total) {
					helper.end = data.total;
				}
				products.set(data.products);
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	}

	const handlePageChange = (pageNr: number) => {
		helper.page = pageNr;

		helper.start = pageSize * (helper.page - 1) + 1;
		helper.end = helper.start + pageSize - 1;

		page.url.searchParams.set('page', helper.page.toString());
		page.url.searchParams.set('pageSize', pageSize.toString());

		replaceState(page.url, page.state);
		fetchProducts(helper.page);
	};
</script>

{#if $products.length === 0}
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
		class="mb-4 grid grid-flow-row auto-rows-max gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
	>
		{#each $products as product, index}
			<ProductCard {product} includeFavouriteButton={true} />
		{/each}
	</div>
	<div class="mb-4 flex flex-col items-center justify-center gap-2">
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
