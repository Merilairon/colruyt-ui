<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Badge, Button, Spinner } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let previousPage: string = '/promotions';

	let promotion: any = undefined;

	onMount(async () => {
		try {
			let response = await fetch(
				`https://colruyt.merilairon.com/api/promotions/${page.params.slug}`
			);
			promotion = await response.json();
		} catch (error) {
			console.log(error);
		}
	});

	function goBack() {
		goto(previousPage);
	}

	//TODO: Add benefit infomation to the promotion
</script>

<div>
	<Button aria-label="Go back" class="mb-4" on:click={goBack}>
		<ArrowLeftOutline class="ms-2 h-5 w-5" />
		Back
	</Button>
	{#if promotion && promotion.message !== 'Promotion not found'}
		<div class="promotion-info mb-4">
			<h1 class="mb-4 text-3xl font-bold dark:text-white">Promotion Info:</h1>
			<p class="text-2xl font-bold dark:text-white">
				Promotion Code: <span class=" text-xl font-normal dark:text-white"
					>{promotion?.promotionId}</span
				>
			</p>
			<p class="text-2xl font-bold dark:text-white">
				Promotion Type: <span class=" text-xl font-normal dark:text-white"
					>{promotion?.promotionType}</span
				>
			</p>
			<p class="text-2xl font-bold dark:text-white">
				Promotion Active: <span class=" text-xl font-normal dark:text-white"
					>{promotion?.activeStartDate.toLocaleString().replaceAll('-', '/')}
					- {promotion?.activeEndDate.toLocaleString().replaceAll('-', '/')}</span
				>
			</p>
			{#each promotion?.benefits as benefit (benefit.id)}
				<Badge color="red" class="mr-4 mt-4 min-h-20 min-w-48">
					<span class="float-left m-2 p-2 text-left">
						- {benefit.benefitAmount
							? '€' + benefit.benefitAmount / 100
							: benefit.benefitPercentage + '%'}
					</span>
					<span class="float-left m-2 border-l-2 border-gray-800 p-2 text-right">
						From: {benefit.minLimit}
						{benefit.limitUnit}<br />
						{#if benefit.maxLimit}
							To: {benefit.maxLimit} {benefit.limitUnit}
						{/if}
					</span>
				</Badge>
			{/each}
		</div>
		<div class="products-panel">
			<h1 class="mb-4 text-3xl font-bold dark:text-white">Products:</h1>
			<div
				class="mb-4 grid auto-cols-max grid-flow-col grid-rows-1 gap-5 overflow-scroll"
				role="list"
				aria-label="Product list"
			>
				{#each promotion.products as product (product.productId)}
					<div role="listitem">
						<ProductCard {product} includeFavouriteButton={false} />
					</div>
				{/each}
			</div>
		</div>
	{:else if promotion && promotion.message === 'Promotion not found'}
		<div class="text-center">
			<h1 class="text-3xl font-bold dark:text-white">Promotion not found</h1>
		</div>
	{:else}
		<div class="loading-state">
			<div class="text-center">
				<Spinner />
			</div>
		</div>
	{/if}
</div>

<style>
	.loading-state {
		display: grid;
		place-items: center;
		min-height: 200px;
	}
</style>
