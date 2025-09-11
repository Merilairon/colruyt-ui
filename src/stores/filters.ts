import { persisted } from 'svelte-persisted-store';

const filters = persisted<
	{
		filterName: string;
		fromPercentage: number;
		toPercentage: number;
	}[]
>('filters', []);

export default filters;
