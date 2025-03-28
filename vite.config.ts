import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		minify: process.env.NODE_ENV === 'production',
		assetsInlineLimit: 0
	},
	resolve: {
		extensions: ['.js', '.ts', '.svelte']
	},
	ssr: {
		noExternal: ['@sveltejs/kit']
	}
});
