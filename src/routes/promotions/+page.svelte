<script lang="ts">
	import { Badge, Button, Card, Spinner, Select, Label } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import promotions from '../../stores/promotions';

	let filteredPromotions = $promotions;

	//TODO: add real data
	//TODO: add infinite scroll
	onMount(async () => {
		//TODO: change to env value
		fetch('https://run.mocky.io/v3/fb6a43de-990e-4519-89cb-72984c606cc8')
			.then((response) => response.json())
			.then((data) => {
				promotions.set(data);
				filteredPromotions = $promotions;
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	});
	let selectedSortOption = '';
	let sortOptions = [
		{ value: 'asc', name: 'Ascending' },
		{ value: 'desc', name: 'Descending' }
	];

	function sortPromotions() {
		if (selectedSortOption === 'asc') {
			filteredPromotions = [...$promotions].sort(
				(a, b) => a.benefit[0].benefitPercentage - b.benefit[0].benefitPercentage
			);
		} else if (selectedSortOption === 'desc') {
			filteredPromotions = [...$promotions].sort(
				(a, b) => b.benefit[0].benefitPercentage - a.benefit[0].benefitPercentage
			);
		} else {
			console.log('sorting');

			filteredPromotions = [...$promotions];
		}
	}

	function resetSort() {
		selectedSortOption = '';
		sortPromotions();
	}
</script>

{#if $promotions.length === 0}
	<div class="text-center"><Spinner /></div>
{:else}
	<div class="mb-5 flex w-80 justify-center">
		<Label class="mr-2 w-60 ">
			Sort: <Select
				on:change={sortPromotions}
				class="mt-2"
				items={sortOptions}
				bind:value={selectedSortOption}
			/>
		</Label>
		<div class="resetBtn">
			<Button on:click={resetSort} style="height:42px; margin-top:28px" class="w-20">Reset</Button>
		</div>
	</div>

	<div
		class="grid grid-flow-row auto-rows-max gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
	>
		{#each filteredPromotions as promotion, index}
			<Card
				padding="sm"
				class={promotion.text && promotion?.text[0]?.text.includes('TOP promo')
					? 'shadow-orange-500'
					: ''}
			>
				<div class="card">
					<a href="/promotions/{promotion.promotionId}">
						<div class="card-image">
							<img src={promotion.highestSalesRank?.thumbnail} alt={promotion.name} />
						</div>
						<div class="px-5 pb-5">
							<div>
								<h5
									class="text-center text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
								>
									{#if promotion.text}
										{promotion?.text[0]?.text}
									{:else}
										{promotion?.highestSalesRank?.seoBrand}
									{/if}
								</h5>
							</div>
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
					</a>
					{#if promotion.text && promotion.text[0]?.text?.includes('TOP promo')}
						<div class="top-promo font-bold">
							<span class="text-orange-500">TOP</span> Promo
						</div>
					{/if}
				</div>
			</Card>
		{/each}
	</div>
{/if}

<style>
	.card {
		position: relative;
	}

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

	.top-promo {
		background-color: darkslategray;
		border-radius: 5px;
		color: white;
		padding: 5px;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
