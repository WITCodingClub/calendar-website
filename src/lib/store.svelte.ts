import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export const selected = writable('');

// Navigate only when the value names another page. The top bar sets the value
// to the current path on every navigation. A goto to that path would drop the
// query string, such as a catalog search (?q=) or a term (?term_uid=).
selected.subscribe((value) => {
    if (browser && value && value !== location.pathname) {
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        goto(value);
    }
})
