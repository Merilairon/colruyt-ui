import { writable } from 'svelte/store';

const promotions = writable<any[]>([]);

export default promotions;
