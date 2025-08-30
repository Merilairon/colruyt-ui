<script lang="ts">
	import { Badge, Button, Card } from 'flowbite-svelte';
	import { HeartOutline, HeartSolid } from 'flowbite-svelte-icons';
	import favourites from '../../stores/favourite';

	interface Props {
		includeFavouriteButton?: boolean;
		product: any;
	}

	let { includeFavouriteButton = false, product }: Props = $props();

	function handleFavourite(productId: string) {
		favourites.update((favs) => {
			if (favs.includes(productId)) {
				return favs.filter((fav) => fav !== productId);
			}
			return [...favs, productId];
		});
	}
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
				<Badge rounded color="red" class="ms-3"
					>{product?.pricechange?.priceChange > 0 ? '+' : ''}{Math.floor(
						product?.pricechange?.priceChangePercentage * 10000 || 0
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
					<!--
					<Badge class="ms-3" slot="text"
						>{product?.pricechange?.priceChange > 0 ? '+' : ''}{Math.floor(
							product?.pricechange?.priceChangePercentage * 10000 || 0
						) / 100}%
					</Badge>-->
					<div class="ms-3"></div>
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
					class="h-8 w-8 !p-2"
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
	</div>
</Card>

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

	.name-container {
		min-height: 90px;
	}

	.favouriteBtn {
		position: absolute;
		top: 0;
		right: 0;
	}
</style>
