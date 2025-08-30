<script lang="ts">
	import '../app.css';

	import {
		Button,
		DarkMode,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Footer,
		FooterCopyright,
		FooterIcon
	} from 'flowbite-svelte';

	import { page } from '$app/state';
	import { CaretUpSolid, GithubSolid } from 'flowbite-svelte-icons';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	let activeUrl: any = $derived(page.url.pathname);
	let hideSpeedDial = $state(true);

	onMount(() => {
		if (browser) {
			window.addEventListener('scroll', () => {
				hideSpeedDial = window.scrollY <= 200;
			});
		}
	});

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<svelte:head>
	<link href="/images/colruit-logo.svg" rel="icon" type="image/svg" />
</svelte:head>

<div class="relative px-8">
	<Navbar
		class="fixed start-0 top-0 z-20 w-full border-b bg-white px-2 py-2.5 sm:px-4 dark:bg-slate-600"
		color="form"
	>
		<NavBrand href="/">
			<img alt="Colruit Logo" class="me-3 h-6 sm:h-9" src="/images/colruit-logo.svg" />
			<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
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
<div style="margin-top: 5em">
	<div class="p-8">
		{@render children?.()}
	</div>
</div>
<Footer footerType="sitemap">
	<div class="bg-gray-100 px-4 py-6 md:flex md:items-center md:justify-between dark:bg-gray-700">
		<FooterCopyright
			class="text-sm text-gray-900 sm:text-center dark:text-gray-200"
			href="/"
			by="Merilairon™"
		/>
		<div class="mt-4 flex space-x-6 sm:justify-center md:mt-0 rtl:space-x-reverse">
			<FooterIcon href="https://github.com/Merilairon/colruyt-ui">
				<GithubSolid
					class="h-5 w-5 text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
				/>
			</FooterIcon>
		</div>
	</div>
</Footer>

{#if !hideSpeedDial}
	<Button color="red" onclick={scrollToTop} pill={true} class="fixed end-6 bottom-6 !p-3">
		<CaretUpSolid class="h-8 w-8" />
	</Button>
{/if}
