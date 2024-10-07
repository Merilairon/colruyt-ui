<script lang="ts">
	import { Search, Button, Card, Badge, Toast, Spinner } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import { debounce } from '../../lib/debounce';
	import { HeartOutline, HeartSolid, CheckCircleSolid } from 'flowbite-svelte-icons';
	import favourites from '../../stores/favourite';
	import products from '../../stores/products';
	import { onMount } from 'svelte';

	let toastStatus = false;
	let counter = 6;

	function trigger() {
		toastStatus = true;
		counter = 6;
		timeout();
	}

	function timeout() {
		if (--counter > 0) return setTimeout(timeout, 1000);
		toastStatus = false;
	}
	let filteredProducts = $products;

	onMount(async () => {
		//TODO: change to env value
		fetch('https://run.mocky.io/v3/7808d1e9-5e10-4445-9d2c-034b5c923c48')
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				products.set(data);
				filteredProducts = $products;
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	});

	const searchProductsDebounced = debounce(searchProducts, 1000);

	function searchProducts(event: Event) {
		filteredProducts = $products.filter((product) =>
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
	{#if $products.length === 0}
		<div class="text-center"><Spinner /></div>
	{:else}
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
								class="name-container text-center text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
							>
								{product.LongName}
							</h5>
						</a>
					</div>
					<div class="flex items-center justify-between">
						<Badge slot="text" class="ms-3">{product.difference || 0 * 100}%</Badge>
						<span class="text font-bold text-gray-900 dark:text-white"
							>€{product.price.basicPrice}</span
						>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>
<div class="flex gap-10">
	<Toast dismissable={false} transition={slide} bind:toastStatus>
		<CheckCircleSolid slot="icon" class="h-5 w-5" />
		Autohide in {counter}s.
	</Toast>
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

	.name-container {
		min-height: 60px;
	}
</style>
