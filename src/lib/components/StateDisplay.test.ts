import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import StateDisplay from './StateDisplay.svelte';

describe('StateDisplay', () => {
	it('renders nothing when neither loading nor empty', () => {
		const { container } = render(StateDisplay, {
			props: { loading: false, empty: false, emptyText: '', loadingText: '' }
		});
		expect(container.querySelector('.loading-state')).toBeNull();
	});

	it('shows a spinner when loading is true', () => {
		render(StateDisplay, {
			props: { loading: true, empty: false, emptyText: '', loadingText: '' }
		});
		// The Spinner renders an SVG with role="status"
		const spinner = document.querySelector('[role="status"]');
		expect(spinner).not.toBeNull();
	});

	it('shows loadingText when loading is true and loadingText is provided', () => {
		render(StateDisplay, {
			props: { loading: true, empty: false, emptyText: '', loadingText: 'Please wait…' }
		});
		expect(screen.getByText('Please wait…')).toBeInTheDocument();
	});

	it('does not show loadingText when it is not provided', () => {
		render(StateDisplay, {
			props: { loading: true, empty: false, emptyText: '', loadingText: '' }
		});
		// No paragraph should be rendered for the loading text
		expect(screen.queryByText('Please wait…')).toBeNull();
	});

	it('shows emptyText when empty is true and loading is false', () => {
		render(StateDisplay, {
			props: { loading: false, empty: true, emptyText: 'No results found', loadingText: '' }
		});
		expect(screen.getByText('No results found')).toBeInTheDocument();
	});

	it('prefers loading state over empty state when both are true', () => {
		render(StateDisplay, {
			props: { loading: true, empty: true, emptyText: 'No results found', loadingText: '' }
		});
		// Loading block shown, empty block not shown
		expect(screen.queryByText('No results found')).toBeNull();
	});
});
