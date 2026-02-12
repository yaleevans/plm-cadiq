import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			// Anything starting with /tc will be forwarded to Teamcenter
			'/tc': {
				target: 'http://helixcoredev01:8080',
				changeOrigin: true
				// ws: true, // only if you ever need websockets
				// secure: false, // only needed for https targets with self-signed certs
			}
		}
	}
});
