<script lang="ts">
	import { Search, Button, Card, Badge, Toast } from 'flowbite-svelte';
	import { debounce } from '../../lib/debounce';
	import { HeartOutline, HeartSolid, CheckCircleSolid } from 'flowbite-svelte-icons';
	import favourites from '../../stores/favourite';

	//TODO: add real data
	//TODO: add infinite scroll
	let products: any[] = [
			{
				name: 'Aardappelen',
				price: 1.99,
				technicalArticleNumber: '15487',
				squareImage:
					'https://static.colruytgroup.com/images/200x200/std.lang.all/21/54/asset-342154.jpg',
				difference: -0.79
			},
			{
				name: 'Pepsi Zero Sugar',
				price: 1.85,
				technicalArticleNumber: '16782',
				squareImage:
					'https://static.colruytgroup.com/images/200x200/std.lang.all/25/73/asset-3432573.jpg',
				difference: -0.15
			},
			{
				name: 'Aardappelen',
				price: 1.99,
				technicalArticleNumber: '124786',
				squareImage:
					'https://static.colruytgroup.com/images/200x200/std.lang.all/21/54/asset-342154.jpg',
				difference: -0.79
			},
			{
				name: 'Pepsi Zero Sugar',
				price: 1.85,
				technicalArticleNumber: '225845',
				squareImage:
					'https://static.colruytgroup.com/images/200x200/std.lang.all/25/73/asset-3432573.jpg',
				difference: -0.15
			},
			{
				name: 'Aardappelen',
				price: 1.99,
				technicalArticleNumber: '325844',
				squareImage:
					'https://static.colruytgroup.com/images/200x200/std.lang.all/21/54/asset-342154.jpg',
				difference: -0.79
			},
			{
				name: 'Pepsi Zero Sugar',
				price: 1.85,
				technicalArticleNumber: '98755',
				squareImage:
					'https://static.colruytgroup.com/images/200x200/std.lang.all/25/73/asset-3432573.jpg',
				difference: -0.15
			},
			{
				name: 'Aardappelen',
				price: 1.99,
				technicalArticleNumber: '245347',
				squareImage:
					'https://static.colruytgroup.com/images/200x200/std.lang.all/21/54/asset-342154.jpg',
				difference: -0.79
			},
			{
				name: 'Pepsi Zero Sugar',
				price: 1.85,
				technicalArticleNumber: '366587',
				squareImage:
					'https://static.colruytgroup.com/images/200x200/std.lang.all/25/73/asset-3432573.jpg',
				difference: -0.15
			}
		],
		filteredProducts = products;

	const searchProductsDebounced = debounce(searchProducts, 1000);

	function searchProducts(event: Event) {
		filteredProducts = products.filter((product) =>
			product.name.toLowerCase().includes((event.target as HTMLInputElement).value.toLowerCase())
		);
	}

	function handleFavourite(technicalArticleNumber: string) {
		favourites.update((favs) => {
			if (favs.includes(technicalArticleNumber)) {
				return favs.filter((fav) => fav !== technicalArticleNumber);
			}
			return [...favs, technicalArticleNumber];
		});
	}
</script>

<div class="p-8">
	<Search style="margin-bottom: 1em" on:input={searchProductsDebounced}></Search>
	<div
		class="grid grid-flow-row auto-rows-max gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7"
	>
		{#each filteredProducts as product, index}
			<Card padding="sm" data-index={product.technicalArticleNumber}>
				<Button
					on:click={() => handleFavourite(product.technicalArticleNumber)}
					pill={true}
					class="h-8 w-8 !p-2"
					style="margin-left: auto; order: 0;"
				>
					{#if $favourites.includes(product.technicalArticleNumber)}
						<HeartSolid class="h-6 w-6" />
					{:else}
						<HeartOutline class="h-6 w-6" />
					{/if}
				</Button>
				<a href="/" class="card-image">
					<img src={product.squareImage} alt={product.name} />
				</a>
				<div class="px-5 pb-5">
					<a href="/">
						<h5
							class="text-center text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
						>
							{product.name}
						</h5>
					</a>
				</div>
				<div class="flex items-center justify-between">
					<Badge slot="text" class="ms-3">{product.difference * 100}%</Badge>
					<span class="text font-bold text-gray-900 dark:text-white">€{product.price}</span>
				</div>
			</Card>
		{/each}
	</div>
</div>

<style>
	.card-image {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 120px;
		height: 120px;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 20px;
		max-width: 100%;
	}

	.card-image img {
		max-width: 100%;
		max-height: 100%;
		flex-shrink: 0;
	}
</style>
