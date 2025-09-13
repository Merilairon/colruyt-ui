<script lang="ts">
	import {
		Modal,
		Label,
		Button,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import filters from '../../stores/filters';
	import {
		ArrowDownOutline,
		ArrowUpOutline,
		CogOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	let { managerModal = $bindable() } = $props();

	const closeModal = () => (managerModal = false);
	const orderUp = (index: number) => {
		let clonedArray = [...$filters];
		const temp = clonedArray[index];
		clonedArray[index] = clonedArray[index - 1];
		clonedArray[index - 1] = temp;
		filters.set(clonedArray);
	};

	const orderDown = (index: number) => {
		let clonedArray = [...$filters];
		const temp = clonedArray[index];
		clonedArray[index] = clonedArray[index + 1];
		clonedArray[index + 1] = temp;
		filters.set(clonedArray);
	};

	const RemoveFilter = (index: number) => {
		filters.update((filters) => {
			filters.splice(index, 1);
			return filters;
		});
	};
</script>

<Modal bind:open={managerModal} size="lg">
	<div class="flex flex-col space-y-6">
		<h3 class="mb-4 text-center text-xl font-medium text-gray-900 dark:text-white">
			Manage filters
		</h3>
		{#if $filters.length === 0}
			<h4 class="flex flex-col items-center justify-center">No filters added yet</h4>
		{:else}
			<Table>
				<TableHead>
					<TableHeadCell align="center">Order</TableHeadCell>
					<TableHeadCell align="right">Filter Name</TableHeadCell>
					<TableHeadCell align="right">From Percentage</TableHeadCell>
					<TableHeadCell align="right">To Percentage</TableHeadCell>
					<TableHeadCell align="center">Actions</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each $filters as filter, index}
						<TableBodyRow>
							<TableBodyCell align="center">
								{#if index !== 0}
									<Button class="cursor-pointer" onclick={() => orderUp(index)}
										><ArrowUpOutline /></Button
									>
								{/if}
								{#if index !== $filters.length - 1}
									<Button class="cursor-pointer" onclick={() => orderDown(index)}
										><ArrowDownOutline /></Button
									>
								{/if}
							</TableBodyCell>
							<TableBodyCell align="right">{filter.filterName}</TableBodyCell>
							<TableBodyCell align="right">{filter.fromPercentage}%</TableBodyCell>
							<TableBodyCell align="right">{filter.toPercentage}%</TableBodyCell>
							<TableBodyCell align="center">
								<Button class="cursor-pointer">
									<CogOutline />
								</Button>
								<Button class="cursor-pointer" onclick={() => RemoveFilter(index)}>
									<TrashBinOutline />
								</Button>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}

		<Button onclick={closeModal} value="Close">Close</Button>
	</div>
</Modal>
