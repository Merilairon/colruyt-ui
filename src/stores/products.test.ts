import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import products from './products';

describe('products store', () => {
	beforeEach(() => {
		products.set([]);
	});

	it('initialises with an empty array', () => {
		expect(get(products)).toEqual([]);
	});

	it('can be set to a list of products', () => {
		const mockProducts = [{ productId: '1', name: 'Apple' }, { productId: '2', name: 'Banana' }];
		products.set(mockProducts);
		expect(get(products)).toEqual(mockProducts);
	});

	it('can be updated by appending a product', () => {
		const product = { productId: '1', name: 'Apple' };
		products.update((prev) => [...prev, product]);
		expect(get(products)).toHaveLength(1);
		expect(get(products)[0]).toEqual(product);
	});

	it('can be reset to an empty array', () => {
		products.set([{ productId: '1', name: 'Apple' }]);
		products.set([]);
		expect(get(products)).toEqual([]);
	});

	it('notifies subscribers when the value changes', () => {
		const values: unknown[][] = [];
		const unsubscribe = products.subscribe((v) => values.push(v));

		products.set([{ productId: '99' }]);
		products.set([]);

		unsubscribe();

		expect(values).toHaveLength(3); // initial + two sets
		expect(values[1]).toEqual([{ productId: '99' }]);
		expect(values[2]).toEqual([]);
	});
});
