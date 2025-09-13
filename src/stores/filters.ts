import { persisted } from 'svelte-persisted-store';

const filters = persisted<
	{
		filterName: string;
		fromPercentage: number;
		toPercentage: number;
	}[]
>('filters', [
	{ filterName: '-100% to -50%', fromPercentage: -100, toPercentage: -50 },
	{ filterName: '-50% to -25%', fromPercentage: -50, toPercentage: -25 },
	{ filterName: '-25% to 0%', fromPercentage: -25, toPercentage: 0 }
]);

export default filters;
