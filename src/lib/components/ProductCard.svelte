<script lang="ts">
	import { Badge, Button, Card } from 'flowbite-svelte';
	import { AppleFullOutline, FireOutline, HeartOutline, HeartSolid } from 'flowbite-svelte-icons';
	import favourites from '../../stores/favourite';

	let { includeFavouriteButton = false, product } = $props();

	let priceChangeP1 = $state({
		priceChange: 0,
		priceChangePercentage: 0
	});
	let priceChangeP2 = $state({
		priceChange: 0,
		priceChangePercentage: 0
	});

	function handleFavourite(productId: string) {
		favourites.update((favs) => {
			if (favs.includes(productId)) {
				return favs.filter((fav) => fav !== productId);
			}
			return [...favs, productId];
		});
	}

	$effect(() => {
		priceChangeP1 = product.priceChanges?.find((pc: any) => pc.priceChangeType === 'P1');
		priceChangeP2 = product.priceChanges?.find((pc: any) => pc.priceChangeType === 'P2');
	});
</script>

<Card data-index={product.productId} class="p-8">
	<div class="card">
		<a href="/products/{product.productId}">
			<div class="card-image">
				<img alt={product.name} class="rounded-xl" src={product.squareImage} />
			</div>
			<div class="px-5 pb-5">
				<h5
					class="name-container text-center text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
				>
					{product.LongName}
				</h5>
			</div>
			<div class="flex items-center justify-between">
				<Badge color="red" class="ms-3" rounded
					>{priceChangeP1?.priceChange > 0 ? '+' : ''}{Math.floor(
						priceChangeP1?.priceChangePercentage * 10000 || 0
					) / 100}%
				</Badge>
				<div class="text-right">
					<span class="text-sm font-bold text-gray-900 dark:text-white"
						>€{product.prices[0]?.basicPrice}</span
					>
				</div>
			</div>
			{#if product.prices[0]?.quantityPrice}
				<div class="flex items-center justify-between">
					<Badge color="red" class="ms-3" rounded
						>{priceChangeP2?.priceChange > 0 ? '+' : ''}{Math.floor(
							priceChangeP2?.priceChangePercentage * 10000 || 0
						) / 100}%
					</Badge>
					<div class="text-right">
						<span class="text font-bold text-orange-500 dark:text-orange-500"
							>€{product.prices[0].quantityPrice} from {product.prices[0].quantityPriceQuantity}
						</span>
					</div>
				</div>
			{/if}
		</a>
		{#if includeFavouriteButton}
			<div class="favouriteBtn">
				<Button
					class="h-8 w-8 cursor-pointer !p-2"
					onclick={() => handleFavourite(product.productId)}
					pill
					color="red"
					style="margin-left: auto; order: 0;"
				>
					{#if $favourites.includes(product.productId)}
						<HeartSolid class="h-6 w-6" />
					{:else}
						<HeartOutline class="h-6 w-6" />
					{/if}
				</Button>
			</div>
		{/if}
		{#if product.IsNew}
			<div class="new font-bold">
				<span class="text-green-500">New</span>
			</div>
		{/if}
		{#if product.IsBio}
			<div class="bio font-bold">
				<AppleFullOutline class="h-6 w-6 text-green-500" />
			</div>
		{/if}
	</div>
</Card>

<style>
	.new {
		background-color: darkslategray;
		border-radius: 5px;
		color: white;
		padding: 5px;
		position: absolute;
		top: 0;
		left: 0;
	}

	.bio {
		background-color: darkslategray;
		border-radius: 5px;
		color: white;
		padding: 5px;
		position: absolute;
		top: 40px;
		left: 0;
	}

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

	.name-container {
		min-height: 90px;
	}

	.favouriteBtn {
		position: absolute;
		top: 0;
		right: 0;
	}
</style>
