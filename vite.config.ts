import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ProxyOptions } from 'vite';

// In production, the rproxy Worker sends these paths to the Rails backend, not
// to this site. Locally, send them to the production backend, so the links to
// them work. Only public, read-only pages belong here.
const backend: ProxyOptions = {
	target: 'https://calendar.witcc.dev',
	changeOrigin: true,
	// Rails redirects /docs to an absolute https URL. Point it back here.
	autoRewrite: true,
	protocolRewrite: 'http'
};

const proxy = {
	'/docs': backend,
	'/llms.txt': backend
};

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: { proxy },
	preview: { proxy }
});
