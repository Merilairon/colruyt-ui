import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import SkeletonCard from './SkeletonCard.svelte';

describe('SkeletonCard', () => {
	it('renders without crashing', () => {
		const { container } = render(SkeletonCard);
		expect(container).toBeTruthy();
	});

	it('has role="status" for accessibility', () => {
		const { container } = render(SkeletonCard);
		const el = container.querySelector('[role="status"]');
		expect(el).not.toBeNull();
	});

	it('contains the animate-pulse class', () => {
		const { container } = render(SkeletonCard);
		const el = container.querySelector('.animate-pulse');
		expect(el).not.toBeNull();
	});

	it('renders the card-image placeholder element', () => {
		const { container } = render(SkeletonCard);
		expect(container.querySelector('.card-image')).not.toBeNull();
	});
});
