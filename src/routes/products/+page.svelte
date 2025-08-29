<script lang="ts">
	import { page } from '$app/state';
	import { Pagination, PaginationItem, Search, Spinner } from 'flowbite-svelte';
	import { debounce } from '$lib/debounce';
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
	import products from '../../stores/products';
	import { onMount } from 'svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { replaceState } from '$app/navigation';

	let pageSize = 60;
	let helper = { start: 1, end: pageSize, page: 1, total: 100 };
	let includeUnavailable = false;
	let filteredProducts = $products;
	let savedSearchValue = '';

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
		await fetchProducts(helper.page, !includeUnavailable, savedSearchValue);
	});

	const searchProductsDebounced = debounce(searchProducts, 1000);

	function searchProducts(event: Event) {
		// 	filteredProducts = $products.filter((product) =>
		// 		product.name.toLowerCase().includes((event.target as HTMLInputElement).value.toLowerCase())
		// 	);

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
			savedSearchValue ? savedSearchValue : undefined
		);
	}

	function fetchProducts(page: number, isAvailable: boolean, searchValue: string | undefined) {
		fetch(
			`${'https://colruyt.merilairon.com/api'}/products?isAvailable=${isAvailable}&page=${page}&size=${pageSize}${searchValue ? `&search=${searchValue}` : ''}`
		)
			.then((response) => response.json())
			.then((data) => {
				helper.total = data.total;
				if (pageSize > data.total) {
					helper.end = data.total;
				}
				products.set(data.products);
				filteredProducts = $products;
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	}

	function previous() {
		if (helper.page > 1) {
			helper.page--;
			helper.start = helper.start - pageSize;
			helper.end = helper.end - pageSize;

			page.url.searchParams.set('searchValue', savedSearchValue);
			page.url.searchParams.set('page', helper.page.toString());
			page.url.searchParams.set('pageSize', pageSize.toString());

			replaceState(page.url, page.state);
			fetchProducts(helper.page, !includeUnavailable, savedSearchValue);
		}
	}

	function next() {
		if (helper.end < helper.total) {
			helper.page++;
			helper.start = helper.start + pageSize;
			helper.end = helper.end + pageSize;
			if (helper.end > helper.total) {
				helper.end = helper.total;
			}

			page.url.searchParams.set('searchValue', savedSearchValue);
			page.url.searchParams.set('page', helper.page.toString());
			page.url.searchParams.set('pageSize', pageSize.toString());

			replaceState(page.url, page.state);
			fetchProducts(helper.page, !includeUnavailable, savedSearchValue);
		}
	}
</script>

<Search class="mb-4" value={savedSearchValue} on:input={searchProductsDebounced}></Search>

{#if $products.length === 0 && !savedSearchValue}
	<div class="loading-state">
		<div class="text-center">
			<Spinner />
		</div>
	</div>
{:else if $products.length === 0 && savedSearchValue}
	<div class="loading-state">
		<div class="text-center">
			
			<span class="font-semibold text-gray-900 dark:text-white">No results found</span>
			
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

		<Pagination pages={[]} on:next={next} on:previous={previous} table large>
			<PaginationItem slot="prev">
				<ArrowLeftOutline class="h-5 w-5" />
			</PaginationItem>
			<PaginationItem slot="next">
				<ArrowRightOutline class="h-5 w-5" />
			</PaginationItem>
		</Pagination>
	</div>
{/if}

<style>
	.loading-state {
		display: grid;
		place-items: center;
		min-height: 200px;
	}
</style>
