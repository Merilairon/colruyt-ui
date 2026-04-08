import { describe, it, expect, beforeEach } from 'vitest';
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

