<script lang="ts">
	import { Search, Spinner, Pagination, PaginationItem } from 'flowbite-svelte';
	import { debounce } from '../../lib/debounce';
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
	import products from '../../stores/products';
	import { onMount } from 'svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let pageSize = 60;
	let helper = { start: 1, end: pageSize, page: 1, total: 100 };
	let includeUnavailable = false;
	let filteredProducts = $products;

	onMount(async () => {
		await fetchProducts(helper.page, !includeUnavailable, undefined);
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

		fetchProducts(
			helper.page,
			!includeUnavailable,
			(event.target as HTMLInputElement).value.toLowerCase()
		);
	}
	function fetchProducts(page: number, isAvailable: boolean, searchValue: string | undefined) {
		fetch(
			`${'http://localhost:3000'}/products?isAvailable=${isAvailable}&page=${page}&size=${pageSize}${searchValue ? `&search=${searchValue}` : ''}`
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
			fetchProducts(helper.page, !includeUnavailable, undefined);
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
			fetchProducts(helper.page, !includeUnavailable, undefined);
		}
	}
</script>

{#if $products.length === 0}
	<div class="text-center"><Spinner /></div>
{:else}
	<Search class="mb-4" on:input={searchProductsDebounced}></Search>
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
