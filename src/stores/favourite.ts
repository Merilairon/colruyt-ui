import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue: string[] = [];
const stringifiedDefaultValue: string = JSON.stringify(defaultValue);
const initialValue: string[] = browser
	? ((JSON.parse(
			window.localStorage.getItem('favourites') || stringifiedDefaultValue
		) as string[]) ?? defaultValue)
	: defaultValue;

const favourites = writable<string[]>(initialValue);

favourites.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('favourites', JSON.stringify(value));
	}
});

export default favourites;
