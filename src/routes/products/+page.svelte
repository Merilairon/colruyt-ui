<script lang="ts">
	import { page } from '$app/state';
	import { PaginationNav, Search, Spinner, Select, Label } from 'flowbite-svelte';
	import { debounce } from '$lib/debounce';
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
	import products from '../../stores/products';
	import { onMount } from 'svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { replaceState } from '$app/navigation';

	// svelte-ignore non_reactive_update
	let pageSize = 60;
	let helper = $state({ start: 1, end: pageSize, page: 1, total: 100 });
	let includeUnavailable = false;
	let savedSearchValue = $state('');
	let selectedSortValue = $state('desc');

	onMount(async () => {
		if (page.url.searchParams.get('includeUnavailable')) {
			includeUnavailable = page.url.searchParams.get('includeUnavailable') === 'true';
		}
		if (page.url.searchParams.get('page')) {
			helper.page = parseInt(page.url.searchParams.get('page') as string);
			helper.start += pageSize * (helper.page - 1);
			helper.end = helper.start + pageSize - 1;
		}
		if (page.url.searchParams.get('pageSize')) {
			pageSize = parseInt(page.url.searchParams.get('pageSize') as string);
		}
		if (page.url.searchParams.get('searchValue')) {
			savedSearchValue = page.url.searchParams.get('searchValue') as string;
		}
		await fetchProducts(helper.page, !includeUnavailable, savedSearchValue, selectedSortValue);
	});

	const searchProductsDebounced = debounce(searchProducts, 1000);

	function searchProducts(event: Event) {
		// reset pagination
		helper.page = 1;
		helper.start = 1;
		helper.end = pageSize;

		savedSearchValue = (event.target as HTMLInputElement).value.toLowerCase();

		page.url.searchParams.set('searchValue', savedSearchValue);
		page.url.searchParams.set('page', helper.page.toString());
		page.url.searchParams.set('pageSize', pageSize.toString());

		replaceState(page.url, page.state);

		fetchProducts(
			helper.page,
			!includeUnavailable,
			savedSearchValue ? savedSearchValue : undefined,
			selectedSortValue
		);
	}

	function fetchProducts(
		page: number,
		isAvailable: boolean,
		searchValue: string | undefined,
		sortValue: string | undefined
	) {
		fetch(
			`${'https://colruyt.merilairon.com/api'}/products?isAvailable=${isAvailable}&page=${page}&size=${pageSize}${searchValue ? `&search=${searchValue}` : ''}${sortValue ? `&sort=${sortValue}` : ''}`
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

	const handleSortChange = () => {
		fetchProducts(helper.page, !includeUnavailable, savedSearchValue, selectedSortValue);
	};

	const handlePageChange = (pageNr: number) => {
		helper.page = pageNr;

		helper.start = pageSize * (helper.page - 1) + 1;
		helper.end = helper.start + pageSize - 1;

		page.url.searchParams.set('searchValue', savedSearchValue);
		page.url.searchParams.set('page', helper.page.toString());
		page.url.searchParams.set('pageSize', pageSize.toString());

		replaceState(page.url, page.state);
		fetchProducts(helper.page, !includeUnavailable, savedSearchValue, selectedSortValue);
	};
</script>

<div class="grid grid-cols-4 gap-4">
	<Search class="col-span-3 mb-4" value={savedSearchValue} oninput={searchProductsDebounced}
	></Search>

	<Select
		class="mb-4"
		items={[
			{ value: 'desc', name: 'Descending' },
			{ value: 'asc', name: 'Ascending' }
		]}
		bind:value={selectedSortValue}
		onchange={handleSortChange}
	></Select>
</div>

{#if $products.length === 0}
	<div class="loading-state animate-pulse">
		<div class="text-center">
			{#if savedSearchValue}
				<span class="font-semibold text-gray-900 dark:text-white">No results found</span>
			{:else}
				<Spinner />
			{/if}
		</div>
	</div>
{:else}
	<div class="mb-4 flex flex-col items-center justify-center gap-2">
		<div class="text-sm text-gray-700 dark:text-gray-400">
			Showing <span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span>
			to
			<span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
			of
			<span class="font-semibold text-gray-900 dark:text-white">{helper.total}</span>
			Entries
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
		<div class="text-sm text-gray-700 dark:text-gray-400">
			Showing <span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span>
			to
			<span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
			of
			<span class="font-semibold text-gray-900 dark:text-white">{helper.total}</span>
			Entries
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
