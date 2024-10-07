import { writable } from 'svelte/store';

const products = writable<any[]>([]);

export default products;
