<script lang="ts">
	import '../app.css';
	import { Button, DarkMode, Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';
	import { page, navigating } from '$app/state';
	import { CaretUpSolid } from 'flowbite-svelte-icons';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Page } from '@sveltejs/kit';
	let activeUrl: any = page.url.pathname;

	let hideSpeedDial = true;

	export const load = (page: Page) => {
		activeUrl = page.url.pathname;
		console.log(page.url.pathname);
	};
	onMount(() => {
		if (browser) {
			window.addEventListener('scroll', () => {
				hideSpeedDial = window.scrollY <= 200;
			});
		}
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<link href="/images/colruit-logo.svg" rel="icon" type="image/svg" />
</svelte:head>

<div class="relative px-8">
	<Navbar class="fixed start-0 top-0 z-20 w-full border-b px-2 py-2.5 sm:px-4" color="form">
		<NavBrand href="/">
			<img alt="Colruit Logo" class="me-3 h-6 sm:h-9" src="/images/colruit-logo.svg" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>Colruit</span
			>
		</NavBrand>
		<NavHamburger />
		<NavUl {activeUrl}>
			<NavLi href="/products">Products</NavLi>
			<NavLi href="/changes">Interesting Changes</NavLi>
			<NavLi href="/promotions">Promotions</NavLi>
			<NavLi href="/favourites">Favourites</NavLi>
		</NavUl>
		<DarkMode />
	</Navbar>
</div>
<div style="margin-top: 3.5em">
	<div class="p-8">
		<slot></slot>
	</div>
</div>

{#if !hideSpeedDial}
	<Button on:click={scrollToTop} pill={true} class="fixed bottom-6 end-6 !p-3">
		<CaretUpSolid class="h-8 w-8" />
	</Button>
{/if}
