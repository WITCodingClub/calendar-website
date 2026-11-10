import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export const selected = writable('');

selected.subscribe((value) => {
	if (browser && value) {
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(value);
	}
});
