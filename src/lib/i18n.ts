import { browser } from '$app/environment';
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('../locales/en.json'));
register('fr', () => import('../locales/fr.json'));
register('nl', () => import('../locales/nl.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: getLocaleFromNavigator()?.slice(0, 2)[0]
});
