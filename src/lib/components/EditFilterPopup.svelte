<script lang="ts">
	import { Modal, Label, Checkbox, Button, Input, Select } from 'flowbite-svelte';
	import filters from '../../stores/filters';
	let { formModal = $bindable(), filter, filterIndex } = $props();
	let error = $state('');
	let filterType = $state('percentage');

	function onaction({ action, data }: { action: string; data: FormData }) {
		error = '';
		if (action === 'edit') {
			const filterName = data.get('filterName')?.toString() || '';
			const newFilter: { filterName: string; fromPercentage?: number; toPercentage?: number; category?: string } = { filterName };

			if (filterType === 'percentage') {
				const from = Number.parseFloat(data.get('fromPercentage')?.toString() || '0');
				const to = Number.parseFloat(data.get('toPercentage')?.toString() || '0');

				if (from > to) {
					error = 'From Percentage must be less than the to Percentage';
					return false;
				}

				newFilter.fromPercentage = from;
				newFilter.toPercentage = to;
			} else {
				newFilter.category = data.get('category')?.toString() || '';
			}

			filters.update((f) => {
                f[filterIndex] = newFilter;
				return f;
			});
		}
		formModal = false;
		return false;
	}

    $effect(() => {
        if(filter.category) {
            filterType = 'category'
        }
    })
</script>

<Modal form bind:open={formModal} size="xs" {onaction}>
	<div class="flex flex-col space-y-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add a new change filter</h3>
		{#if error}
			<Label color="red">{error}</Label>
		{/if}
		<Label class="space-y-2">
			<span>Filter Name</span>
			<Input type="text" name="filterName" placeholder="e.g., High Discounts" required value={filter.filterName}/>
		</Label>
		<Label class="space-y-2">
			<span>Filter Type</span>
			<Select
				bind:value={filterType}
				items={[
					{ value: 'percentage', name: 'Percentage' },
					{ value: 'category', name: 'Category' }
				]}
			/>
		</Label>

		{#if filterType === 'percentage'}
			<Label class="space-y-2">
				<span>From Percentage</span>
				<Input type="number" name="fromPercentage" placeholder="-100" required value={filter.fromPercentage}/>
		</Label>
			<Label class="space-y-2">
				<span>To Percentage</span>
				<Input type="number" name="toPercentage" placeholder="0" required value={filter.toPercentage}/>
		</Label>
		{:else}
			<Label class="space-y-2">
				<span>Category</span>
				<Input type="text" name="category" placeholder="e.g., Fruits" required value={filter.category}/>
		</Label>
		{/if}

		<Button type="submit" value="edit">Save Changes</Button>
	</div>
</Modal>