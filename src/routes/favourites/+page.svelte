<script lang="ts">
	import favourites from '../../stores/favourite';
	import { onMount } from 'svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { _ } from 'svelte-i18n';
	import StateDisplay from '$lib/components/StateDisplay.svelte';

	let pageSize = 60;
	let helper = $state({ page: 1, total: 100 });
	let filteredProducts: any[] = $state([]);
	let doneFetching = $state(false);

	let paginationData = $derived(() => {
		const totalPages = Math.ceil(helper.total / pageSize);
		const pages = Array.from({ length: totalPages }, (_, i) => ({
			name: (i + 1).toString(),
			href: `/favourites?page=${i + 1}`
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
		await fetchProducts(helper.page);
	});

	async function fetchProducts(page: number) {
		if ($favourites.length === 0) {
			filteredProducts = [];
			return;
		}
		try {
			doneFetching = false;
			const response = await fetch(
				`https://colruyt.merilairon.com/api/products?page=${page}&size=${pageSize}&favourites=${$favourites}`
			);
			const data = await response.json();
			helper.total = data.total;
			filteredProducts = data.products;
		} catch (error) {
			console.log(error);
		} finally {
			doneFetching = true;
		}
	}

	const handlePageChange = (pageNr: number) => {
		helper.page = pageNr;
		fetchProducts(helper.page);
	};
</script>

{#if $favourites.length === 0}
	<div class="text-center text-gray-900 dark:text-white">Add some favourites to see them here</div>
{:else}
	<StateDisplay
		loading={!doneFetching && filteredProducts.length === 0}
		empty={doneFetching && filteredProducts.length === 0}
		emptyText="No favourite products found"
	/>

	{#if filteredProducts.length > 0}
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
			class="mb-4 grid grid-flow-row auto-rows-max gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
		>
			{#each filteredProducts as product, index}
				<ProductCard {product} includeFavouriteButton={true} />
			{/each}
		</div>

		<Pagination pages={paginationData} onPageChange={handlePageChange} />
	{/if}
{/if}
