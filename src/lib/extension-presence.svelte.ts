import { browser } from '$app/environment';
import { watchExtension, type ExtensionPresence } from './extension';

class ExtensionState {
	presence = $state<ExtensionPresence>({ status: 'unknown' });
}

export const extensionState = new ExtensionState();

if (browser) {
	watchExtension((presence) => {
		extensionState.presence = presence;
	});
}
