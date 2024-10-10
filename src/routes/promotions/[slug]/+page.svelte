<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	function goBack() {
		goto('/promotions');
	}
</script>

<div>
	<Button on:click={goBack}>
		<ArrowLeftOutline class="ms-2 h-5 w-5" /> Back
	</Button>
</div>
