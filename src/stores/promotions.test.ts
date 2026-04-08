import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import promotions from './promotions';

describe('promotions store', () => {
	beforeEach(() => {
		promotions.set([]);
	});

	it('initialises with an empty array', () => {
		expect(get(promotions)).toEqual([]);
	});

	it('can be set to a list of promotions', () => {
		const mockPromotions = [
			{ promotionId: 'promo1', benefits: [] },
			{ promotionId: 'promo2', benefits: [] }
		];
		promotions.set(mockPromotions);
		expect(get(promotions)).toEqual(mockPromotions);
	});

	it('can be updated by appending a promotion', () => {
		const promo = { promotionId: 'promo1', benefits: [] };
		promotions.update((prev) => [...prev, promo]);
		expect(get(promotions)).toHaveLength(1);
		expect(get(promotions)[0]).toEqual(promo);
	});

	it('can be reset to an empty array', () => {
		promotions.set([{ promotionId: 'promo1' }]);
		promotions.set([]);
		expect(get(promotions)).toEqual([]);
	});

	it('notifies subscribers when the value changes', () => {
		const values: unknown[][] = [];
		const unsubscribe = promotions.subscribe((v) => values.push(v));

		promotions.set([{ promotionId: 'p1' }]);
		promotions.set([]);

		unsubscribe();

		expect(values).toHaveLength(3); // initial + two sets
		expect(values[1]).toEqual([{ promotionId: 'p1' }]);
		expect(values[2]).toEqual([]);
	});
});
