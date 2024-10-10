<script>
	import { page } from '$app/stores';
	import { Button } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import products from '../../../stores/products';
	import { goto } from '$app/navigation';

	let product = $products.find((p) => p.technicalArticleNumber === $page.params.slug);

	function goBack() {
		goto('/products');
	}
</script>

<div>
	<Button on:click={goBack}>
		<ArrowLeftOutline class="ms-2 h-5 w-5" /> Back
	</Button>
</div>
{#if product}
	<div class="container mx-auto px-4">
		<div class="flex flex-col md:flex-row">
			<div class="md:w-1/2">
				<img src={product.squareImage} alt={product.name} class="w-full" />
			</div>
			<div class="md:w-1/2 md:pl-8">
				<h1 class="mb-4 text-3xl font-bold">{product.LongName}</h1>
				<div class="mb-4 flex items-center">
					<span class="text-2xl font-bold">€{product.price.basicPrice}</span>
					<span class="ml-2 text-gray-500">incl. VAT</span>
				</div>
			</div>
		</div>
	</div>
{:else}
	<p>Loading product...</p>
{/if}
