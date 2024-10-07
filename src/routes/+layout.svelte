<script>
	import '../app.css';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/images/colruit-logo.svg" />
</svelte:head>

<div class="relative px-8">
	<Navbar color="form" class="fixed start-0 top-0 z-20 w-full border-b px-2 py-2.5 sm:px-4">
		<NavBrand href="/">
			<img class="me-3 h-6 sm:h-9" alt="Colruit Logo" src="/images/colruit-logo.svg" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>Colruit</span
			>
		</NavBrand>
		<NavHamburger />
		<NavUl>
			<NavLi href="/">Products</NavLi>
			<NavLi href="/changes">Interesting Changes</NavLi>
			<NavLi href="/promotions">Promotions</NavLi>
			<NavLi href="/favorites">Favorites</NavLi>
		</NavUl>
	</Navbar>
</div>
<div style="margin-top: 3.5em">
	<slot></slot>
</div>
