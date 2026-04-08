import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

// $app/environment is aliased to a mock in vitest.config.ts (browser = false)
import favourites from './favourite';

describe('favourite store (non-browser)', () => {
	beforeEach(() => {
		favourites.set([]);
	});

	it('initialises with an empty array', () => {
		expect(get(favourites)).toEqual([]);
	});

	it('adds a product id when it is not already in favourites', () => {
		favourites.update((favs) => [...favs, 'product-1']);
		expect(get(favourites)).toContain('product-1');
	});

	it('removes a product id when it is already in favourites', () => {
		favourites.set(['product-1', 'product-2']);
		favourites.update((favs) => favs.filter((id) => id !== 'product-1'));
		expect(get(favourites)).not.toContain('product-1');
		expect(get(favourites)).toContain('product-2');
	});

	it('can hold multiple product ids', () => {
		favourites.set(['a', 'b', 'c']);
		expect(get(favourites)).toHaveLength(3);
	});

	it('can be reset to an empty array', () => {
		favourites.set(['a', 'b']);
		favourites.set([]);
		expect(get(favourites)).toEqual([]);
	});

	it('notifies subscribers when the value changes', () => {
		const values: string[][] = [];
		const unsubscribe = favourites.subscribe((v) => values.push([...v]));

		favourites.set(['x']);
		favourites.set([]);

		unsubscribe();

		expect(values).toHaveLength(3); // initial + two sets
		expect(values[1]).toEqual(['x']);
		expect(values[2]).toEqual([]);
	});
});

describe('favourite store (browser)', () => {
	// Reset module registry and localStorage before each test so the store
	// module is re-evaluated with browser = true and a clean storage state.
	beforeEach(() => {
		vi.resetModules();
		localStorage.clear();
	});

	afterEach(() => {
		vi.doUnmock('$app/environment');
	});

	async function importBrowserStore() {
		// vi.doMock is non-hoisted, so it takes effect for the dynamic import below
		vi.doMock('$app/environment', () => ({ browser: true }));
		const { default: store } = await import('./favourite');
		return store;
	}

	it('initialises from localStorage when previously stored data is present', async () => {
		localStorage.setItem('favourites', JSON.stringify(['stored-1', 'stored-2']));
		const store = await importBrowserStore();
		expect(get(store)).toEqual(['stored-1', 'stored-2']);
	});

	it('initialises with an empty array when localStorage has no entry', async () => {
		const store = await importBrowserStore();
		expect(get(store)).toEqual([]);
	});

	it('persists a new value to localStorage when the store is updated', async () => {
		const store = await importBrowserStore();
		store.set(['item-1', 'item-2']);
		expect(localStorage.getItem('favourites')).toBe(JSON.stringify(['item-1', 'item-2']));
	});

	it('reflects item removal in localStorage', async () => {
		localStorage.setItem('favourites', JSON.stringify(['a', 'b']));
		const store = await importBrowserStore();
		store.update((favs) => favs.filter((id) => id !== 'a'));
		expect(localStorage.getItem('favourites')).toBe(JSON.stringify(['b']));
	});

	it('persists an empty array to localStorage when the store is reset', async () => {
		localStorage.setItem('favourites', JSON.stringify(['a']));
		const store = await importBrowserStore();
		store.set([]);
		expect(localStorage.getItem('favourites')).toBe(JSON.stringify([]));
	});
});

