<script lang="ts">
	import { Modal, Label, Checkbox, Button, Input } from 'flowbite-svelte';
	import filters from '../../stores/filters';
	let { formModal = $bindable() } = $props();
	let error = $state('');

	function onaction({ action, data }: { action: string; data: FormData }) {
		error = '';
		let from = Number.parseFloat(data.get('fromPercentage')?.toString() || '0'),
			to = Number.parseFloat(data.get('toPercentage')?.toString() || '0');
		if (action === 'add' && from > to) {
			error = 'From Percentage must be less than the to Percentage';
			return false;
		} else {
			filters.update((filters) => {
				filters.push({
					filterName: data.get('filterName')?.toString() || '',
					fromPercentage: from,
					toPercentage: to
				});
				return filters;
			});
			formModal = false;
			return false;
		}
	}
</script>

<Modal form bind:open={formModal} size="xs" {onaction}>
	<div class="flex flex-col space-y-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add a new change filter</h3>
		{#if error}
			<Label color="red">{error}</Label>
		{/if}
		<Label class="space-y-2">
			<span>Filter Name</span>
			<Input type="text" name="filterName" placeholder="From -1000% to 0%" required />
		</Label>
		<Label class="space-y-2">
			<span>From Percentage</span>
			<Input type="number" name="fromPercentage" placeholder="-1000%" required />
		</Label>
		<Label class="space-y-2">
			<span>To Percentage</span>
			<Input type="number" name="toPercentage" placeholder="0%" required />
		</Label>
		<Button type="submit" value="add">Add Filter</Button>
	</div>
</Modal>
