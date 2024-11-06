<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		Spinner,
		Select,
		Label,
		Pagination,
		PaginationItem
	} from 'flowbite-svelte';
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import promotions from '../../stores/promotions';

	let pageSize = 60;
	let helper = { start: 1, end: pageSize, page: 1, total: 100 };
	let filteredPromotions = $promotions;

	//TODO: add infinite scroll or something
	onMount(async () => {
		await fetchPromotions(helper.page);
	});
	let selectedSortOption = '';
	let sortOptions = [
		{ value: 'asc', name: 'Ascending' },
		{ value: 'desc', name: 'Descending' }
	];

	function fetchPromotions(page: number) {
		fetch(`${'http://localhost:3000'}/promotions?page=${page}&size=${pageSize}`)
			.then((response) => response.json())
			.then((data) => {
				helper.total = data.total;
				promotions.set(data.promotions);
				filteredPromotions = $promotions;
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	}

	function previous() {
		if (helper.page > 1) {
			helper.page--;
			helper.start = helper.start - pageSize;
			helper.end = helper.end - pageSize;
			fetchPromotions(helper.page);
		}
	}
	function next() {
		if (helper.end < helper.total) {
			helper.page++;
			helper.start = helper.start + pageSize;
			helper.end = helper.end + pageSize;
			if (helper.end > helper.total) {
				helper.end = helper.total;
			}
			fetchPromotions(helper.page);
		}
	}

	function sortPromotions() {
		if (selectedSortOption === 'asc') {
			filteredPromotions = [...$promotions].sort(
				(a, b) => a.benefits[0].benefitPercentage - b.benefits[0].benefitPercentage
			);
		} else if (selectedSortOption === 'desc') {
			filteredPromotions = [...$promotions].sort(
				(a, b) => b.benefits[0].benefitPercentage - a.benefits[0].benefitPercentage
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
	<div class="mb-4 flex flex-col items-center justify-center gap-2">
		<div class="text-sm text-gray-700 dark:text-gray-400">
			Showing <span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span>
			to
			<span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
			of
			<span class="font-semibold text-gray-900 dark:text-white">{helper.total}</span>
			Entries
		</div>
	</div>

	<div
		class="grid grid-flow-row auto-rows-max gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
	>
		{#each filteredPromotions as promotion, index}
			<Card
				padding="sm"
				class={promotion.text && promotion?.text[0]?.text.includes('TOP promo')
					? 'relative shadow-orange-500'
					: 'relative'}
			>
				<a href="/promotions/{promotion.promotionId}" class="mb-4">
					<div class="card-image">
						<img src={promotion.products[0]?.thumbNail} alt={promotion.promotionId} />
					</div>
					<div class="px-5 pb-5">
						<div>
							<h5
								class="text-center text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
							>
								{#if promotion.text}
									{promotion?.text[0]?.text}
								{:else if promotion.seoBrandList}
									{#each promotion.seoBrandList.slice(0, 5) as brandName}
										{brandName}<br />
									{/each}
								{/if}
							</h5>
						</div>
					</div>

					<div class="promo-info-left">
						<Badge slot="text" class="ms-3"
							>-
							{#if promotion.benefits[0].benefitPercentage}
								{promotion.benefits[0].benefitPercentage}%
							{:else}
								€{promotion.benefits[0].benefitAmount / 100}
							{/if}
						</Badge>
					</div>
					<div class="promo-info-right">
						<span class="text font-bold text-red-700 dark:text-white"
							>Vanaf {promotion.benefits[0]?.minLimit} {promotion.benefits[0]?.limitUnit}</span
						>
					</div>

					{#if promotion.text && promotion.text[0]?.text?.includes('TOP promo')}
						<div class="top-promo font-bold">
							<span class="text-orange-500">TOP</span> Promo
						</div>
					{/if}
				</a>
			</Card>
		{/each}
	</div>
	<div class="mb-4 flex flex-col items-center justify-center gap-2">
		<div class="text-sm text-gray-700 dark:text-gray-400">
			Showing <span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span>
			to
			<span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
			of
			<span class="font-semibold text-gray-900 dark:text-white">{helper.total}</span>
			Entries
		</div>

		<Pagination pages={[]} on:next={next} on:previous={previous} table large>
			<PaginationItem slot="prev">
				<ArrowLeftOutline class="h-5 w-5" />
			</PaginationItem>
			<PaginationItem slot="next">
				<ArrowRightOutline class="h-5 w-5" />
			</PaginationItem>
		</Pagination>
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

	.promo-info-right {
		position: absolute;
		bottom: 1em;
		right: 1em;
	}

	.promo-info-left {
		position: absolute;
		bottom: 1em;
		left: 0;
	}
</style>
