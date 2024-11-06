<script lang="ts">
	import { page } from '$app/stores';
	import { Button, Chart } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import products from '../../../stores/products';
	import { goto } from '$app/navigation';

	let product = $products.find((p) => p.technicalArticleNumber === $page.params.slug);

	let options = {
		chart: {
			height: '400px',
			maxWidth: '100%',
			type: 'area' as const,
			fontFamily: 'Inter, sans-serif',
			dropShadow: {
				enabled: false
			},
			stroke: {
				curve: 'straight'
			},
			toolbar: {
				show: true
			}
		},
		dataLabels: {
			enabled: false
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.7,
				opacityTo: 0.9,
				stops: [0, 90, 100]
			}
		},
		tooltip: {
			enabled: true,
			x: {
				show: true
			}
		},
		series: [
			{
				name: 'Price',
				// return the prices sorted by date
				data: product.prices
					.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
					.map((p: any) => {
						return {
							x: p.date,
							y: p.basicPrice
						};
					}),
				color: '#f5782d'
			}
		]
	};

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
				<img src={product.squareImage} alt={product.name} class="w-half" />
			</div>
			<div class="md:w-1/2 md:pl-8">
				<h1 class="mb-4 text-3xl font-bold dark:text-white">{product.LongName}</h1>
				<div class="mb-4 flex items-center">
					<span class="text-2xl font-bold dark:text-white">€{product.prices[0].basicPrice}</span>
					<span class="ml-2 text-gray-500 dark:text-white">incl. VAT</span>
				</div>
				<Chart {options} />
			</div>
		</div>
	</div>
{:else}
	<p>Loading product...</p>
{/if}

<style>
</style>
