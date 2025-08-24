<script lang="ts">
	import { page } from '$app/state';
	import { Button, Chart, Spinner } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let previousPage: string = '/products';

	afterNavigate(({ from }) => {
		previousPage =
			from?.url.href.replace(from?.url.protocol + '//' + from?.url.host, '') || previousPage;
	});

	let product: any = undefined;
	let options: any = {
		theme: {
			mode: 'dark'
		},
		chart: {
			height: '400px',
			maxWidth: '100%',
			type: 'area' as const,
			fontFamily: 'Inter, sans-serif',
			background: '#475569',
			dropShadow: {
				enabled: false
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
		stroke: {
			curve: 'stepline'
		},
		tooltip: {
			enabled: true,
			x: {
				show: true
			}
		},
		series: [
			{
				name: 'Price P1',
				// return the prices sorted by date
				data: [],
				color: '#f5782d'
			},
			{
				name: 'Price P2',
				// return the prices sorted by date
				data: [],
				color: '#f52d5a'
			}
		],
		xaxis: {
			type: 'datetime'
		}
	};

	onMount(async () => {
		try {
			const response = await fetch(
				`https://colruyt.merilairon.com/api/products/${page.params.slug}`
			);
			product = await response.json();
			options = {
				...options,
				series: [
					{
						...options.series[0],
						data: product?.prices
							.map((p: any) => p)
							.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
							.map((p: any) => {
								return {
									x: p.date,
									y: p.basicPrice
								};
							})
					},
					{
						...options.series[1],
						data: product?.prices
							.map((p: any) => p)
							.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
							.map((p: any) => {
								return {
									x: p.date,
									y: p.quantityPrice
								};
							})
					}
				]
			};
		} catch (error) {
			console.log(error);
		}
	});

	function goBack() {
		goto(previousPage);
	}
</script>

<div>
	<Button on:click={goBack}>
		<ArrowLeftOutline class="ms-2 h-5 w-5" />
		Back
	</Button>
</div>

{#if product && product.message !== 'Product not found'}
	<div class="container mx-auto px-4">
		<div class="flex flex-col md:flex-row">
			<div class="md:w-1/2">
				<img src={product.squareImage} alt={product.LongName} class="w-half rounded-xl" />
			</div>
			<div class="md:w-1/2 md:pl-8">
				<h1 class="mb-4 text-3xl font-bold dark:text-white">{product.LongName}</h1>
				<div class="mb-4 flex items-center">
					<span class="text-2xl font-bold dark:text-white">€{product?.prices[0]?.basicPrice}</span>
					<span class="ml-2 text-gray-500 dark:text-white">incl. VAT</span>
				</div>

				{#if product.prices[0]?.quantityPrice}
					<div class="mb-4 flex items-center">
						<span class="text-2xl font-bold text-orange-500 dark:text-orange-500"
							>€{product?.prices[0]?.quantityPrice}</span
						>
						<span class="ml-2 text-orange-500 dark:text-orange-500"
							>incl. VAT from {product?.prices[0]?.quantityPriceQuantity}</span
						>
					</div>
				{/if}
				<Chart {options} />
			</div>
		</div>
	</div>
{:else if product && product.message === 'Product not found'}
	<div class="text-center">
		<h1 class="text-3xl font-bold dark:text-white">Product not found</h1>
	</div>
{:else}
	<div class="loading-state">
		<div class="text-center">
			<Spinner />
		</div>
	</div>
{/if}

<style>
	.loading-state {
		display: grid;
		place-items: center;
		min-height: 200px;
	}
</style>
