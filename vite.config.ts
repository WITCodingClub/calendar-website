import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ProxyOptions } from 'vite';

// In production, the rproxy Worker sends these paths to the Rails backend,
// because this site has no route for them. Locally, send them to the
// production backend, so the links to them work. Only public, read-only paths
// belong here. /docs/api and /docs/mcp are pages of this site, so only the
// markdown sources and the generated API descriptions go to Rails.
const backend: ProxyOptions = {
	target: 'https://calendar.witcc.dev',
	changeOrigin: true,
	// Rails redirects /docs to an absolute https URL. Point it back here.
	autoRewrite: true,
	protocolRewrite: 'http'
};

const proxy = {
	'^/docs$': backend,
	'^/docs/(api|mcp)\\.md$': backend,
	'/docs/api/': backend,
	'/llms.txt': backend
};

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: { proxy },
	preview: { proxy }
});
