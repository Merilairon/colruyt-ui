<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		Label,
		Pagination,
		PaginationItem,
		PaginationNav,
		Select,
		Spinner
	} from 'flowbite-svelte';
	import { ArrowLeftOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	const { promotion = $bindable() } = $props();
</script>

<Card class={promotion.topPromo ? 'relative p-8 shadow-orange-500' : 'relative p-8'}>
	<a href="/promotions/{promotion.promotionId}" class="mb-4">
		<div class="card-image">
			<img class="rounded-xl" src={promotion.products[0]?.thumbNail} alt={promotion.promotionId} />
		</div>
		<div class="px-5 pb-5">
			<div>
				<h5 class="text-center text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
					{#if promotion.promotionTexts && promotion.promotionTexts.length > 0}
						{promotion.promotionTexts[0]?.text}
					{:else if promotion.seoBrandList}
						{#each promotion.seoBrandList.slice(0, 5) as brandName}
							{brandName}<br />
						{/each}
					{/if}
				</h5>
			</div>
		</div>

		<div class="promo-info-left">
			{#snippet text()}
				<Badge class="ms-3">
					-{promotion.benefits[0]?.benefitPercentage
						? `${promotion.benefits[0]?.benefitPercentage}%`
						: `€${promotion.benefits[0]?.benefitAmount / 100}`}
				</Badge>
			{/snippet}
		</div>
		<div class="promo-info-right">
			<span class="text font-bold text-red-700 dark:text-white"
				>From {promotion.benefits[0]?.minLimit} {promotion?.benefits[0]?.limitUnit}</span
			>
		</div>

		{#if promotion.topPromo}
			<div class="top-promo font-bold">
				<span class="text-orange-500">TOP</span> Promo
			</div>
		{/if}
	</a>
</Card>

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
