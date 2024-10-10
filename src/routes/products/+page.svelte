<script lang="ts">
	import { Search, Button, Card, Badge, Toast, Spinner } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import { debounce } from '../../lib/debounce';
	import { HeartOutline, HeartSolid, CheckCircleSolid } from 'flowbite-svelte-icons';
	import favourites from '../../stores/favourite';
	import products from '../../stores/products';
	import { onMount } from 'svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

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
</script>

{#if $products.length === 0}
	<div class="text-center"><Spinner /></div>
{:else}
	<Search style="margin-bottom: 1em" on:input={searchProductsDebounced}></Search>
	<div
		class="grid grid-flow-row auto-rows-max gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
	>
		{#each filteredProducts as product, index}
			<ProductCard {product} includeFavouriteButton={true} />
		{/each}
	</div>
{/if}
<div class="flex gap-10">
	<Toast dismissable={false} transition={slide} bind:toastStatus>
		<CheckCircleSolid slot="icon" class="h-5 w-5" />
		Autohide in {counter}s.
	</Toast>
</div>
