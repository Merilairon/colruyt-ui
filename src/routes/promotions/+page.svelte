<script lang="ts">
	import { Badge, Card, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import promotions from '../../stores/promotions';

	//TODO: add real data
	//TODO: add infinite scroll

	onMount(async () => {
		//TODO: change to env value
		fetch('https://run.mocky.io/v3/fb6a43de-990e-4519-89cb-72984c606cc8')
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				promotions.set(data);
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	});
</script>

<div class="p-8">
	{#if $promotions.length === 0}
		<div class="text-center"><Spinner /></div>
	{:else}
		<div
			class="grid grid-flow-row auto-rows-max gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7"
		>
			{#each $promotions as promotion, index}
				<Card padding="sm">
					<a href="/" class="card-image">
						<img src={promotion.highestSalesRank?.thumbnail} alt={promotion.name} />
					</a>
					<div class="px-5 pb-5">
						<a href="/">
							<h5
								class="text-center text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
							>
								{promotion?.highestSalesRank?.seoBrand}
							</h5>
						</a>
					</div>
					<div class="flex items-center justify-between">
						<Badge slot="text" class="ms-3"
							>-
							{#if promotion.benefit[0].benefitPercentage}
								{promotion.benefit[0].benefitPercentage}%
							{:else}
								€{promotion.benefit[0].benefitAmount / 100}
							{/if}
						</Badge>
						<span class="text font-bold text-red-700 dark:text-white"
							>Vanaf {promotion.benefit[0].minLimit} {promotion.benefit[0].limitUnit}</span
						>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
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
