<script lang="ts">
	import { Pagination, PaginationItem, PaginationNav, Spinner } from 'flowbite-svelte';
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
	import favourites from '../../stores/favourite';
	import { onMount } from 'svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let pageSize = 60;
	let helper = $state({ start: 1, end: pageSize, page: 1, total: 100 });
	let filteredProducts: any[] = $state([]);

	onMount(async () => {
		await fetchProducts(helper.page);
	});

	function fetchProducts(page: number) {
		if ($favourites.length === 0) {
			filteredProducts = [];
			return [];
		}
		fetch(
			`https://colruyt.merilairon.com/api/products?page=${page}&size=${pageSize}&favourites=${$favourites}`
		)
			.then((response) => response.json())
			.then((data) => {
				helper.total = data.total;
				if (pageSize > data.total) {
					helper.end = data.total;
				}
				filteredProducts = data.products;
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

		fetchProducts(helper.page);
	};
</script>

{#if $favourites.length === 0}
	<div class="text-center text-gray-900 dark:text-white">Add some favourites to see them here</div>
{:else if filteredProducts.length === 0}
	<div class="loading-state">
		<div class="text-center">
			<Spinner />
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
		{#each filteredProducts as product, index}
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
