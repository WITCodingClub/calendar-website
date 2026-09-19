export const EXTENSION_SOURCE = 'wit-calendar';
export const EXTENSION_MARKER = 'witCalendarExtension';
export const EXTENSION_RETURNING_MARKER = 'witCalendarReturning';

export type ExtensionPresence =
	| { status: 'unknown' }
	| { status: 'missing' }
	| { status: 'installed'; version: string; returning: boolean };

export type ExtensionAnnounce = {
	source: typeof EXTENSION_SOURCE;
	type: 'hello' | 'pong';
	version?: string;
	returning?: boolean;
};

export type ExtensionTarget = Pick<Window, 'addEventListener' | 'removeEventListener' | 'postMessage'> & {
	location: { origin: string };
	document: {
		documentElement: { dataset: DOMStringMap };
		visibilityState?: Document['visibilityState'];
		addEventListener?: Document['addEventListener'];
		removeEventListener?: Document['removeEventListener'];
	};
};

export function isExtensionAnnounce(data: unknown): data is ExtensionAnnounce {
	if (data === null || typeof data !== 'object') return false;
	const message = data as Record<string, unknown>;
	return (
		message.source === EXTENSION_SOURCE &&
		(message.type === 'hello' || message.type === 'pong') &&
		(message.version === undefined || typeof message.version === 'string') &&
		(message.returning === undefined || typeof message.returning === 'boolean')
	);
}

export function readExtensionMarker(target: ExtensionTarget): string | undefined {
	const version = target.document.documentElement.dataset[EXTENSION_MARKER];
	return version || undefined;
}

export function readReturningMarker(target: ExtensionTarget): boolean | undefined {
	const raw = target.document.documentElement.dataset[EXTENSION_RETURNING_MARKER];
	if (raw === 'true' || raw === '1') return true;
	if (raw === 'false' || raw === '0') return false;
	return undefined;
}

export function watchExtension(
	onChange: (presence: ExtensionPresence) => void,
	options: { timeoutMs?: number; target?: ExtensionTarget } = {}
): () => void {
	const target = options.target ?? window;
	const timeoutMs = options.timeoutMs ?? 400;
	let found = false;
	let missingTimer: ReturnType<typeof setTimeout> | undefined;

	const installed = (version: string, returning: boolean) => {
		found = true;
		if (missingTimer !== undefined) {
			clearTimeout(missingTimer);
			missingTimer = undefined;
		}
		onChange({ status: 'installed', version, returning });
	};

	const onMessage = (event: Event) => {
		const message = event as MessageEvent;
		if (message.origin !== target.location.origin) return;
		if (message.source !== target) return;
		if (!isExtensionAnnounce(message.data)) return;
		const returning =
			typeof message.data.returning === 'boolean'
				? message.data.returning
				: (readReturningMarker(target) ?? false);
		installed(message.data.version ?? readExtensionMarker(target) ?? '', returning);
	};

	const probe = () => {
		const marker = readExtensionMarker(target);
		if (marker) installed(marker, readReturningMarker(target) ?? false);
		target.postMessage({ source: EXTENSION_SOURCE, type: 'ping' }, target.location.origin);
	};

	const onVisible = () => {
		if (target.document.visibilityState && target.document.visibilityState !== 'visible') return;
		probe();
	};

	target.addEventListener('message', onMessage);
	target.addEventListener('focus', onVisible);
	target.addEventListener('pageshow', onVisible);
	target.document.addEventListener?.('visibilitychange', onVisible);
	probe();

	if (!found) {
		missingTimer = setTimeout(() => {
			if (!found) onChange({ status: 'missing' });
		}, timeoutMs);
	}

	return () => {
		target.removeEventListener('message', onMessage);
		target.removeEventListener('focus', onVisible);
		target.removeEventListener('pageshow', onVisible);
		target.document.removeEventListener?.('visibilitychange', onVisible);
		if (missingTimer !== undefined) clearTimeout(missingTimer);
	};
}
