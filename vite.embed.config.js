import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	// This is not a SvelteKit build, so we don't need SvelteKit plugins
	plugins: [],

	build: {
		// Don't clear the output directory
		emptyOutDir: false,

		// Output to the static folder so it can be served by SvelteKit
		outDir: 'static',

		// We're not building a library with multiple entry points
		// Instead we're building a single file
		lib: {
			entry: resolve(__dirname, 'src/lib/embed.ts'),
			formats: ['iife'],
			name: 'ChatbotWidget',
			fileName: () => 'embed'
		},

		// Optimize for production
		minify: process.env.NODE_ENV === 'production',

		// Make sure source maps are generated
		sourcemap: true,

		// Configure Rollup to avoid code splitting and ensure we get a single file
		rollupOptions: {
			output: {
				// Ensure we get a single file
				inlineDynamicImports: true,
				// Avoid code splitting
				manualChunks: undefined,
				// Use consistent naming
				entryFileNames: 'embed.js',
				// Don't create chunk files
				chunkFileNames: 'embed.js',
				// Don't create asset files
				assetFileNames: 'embed.[ext]'
			}
		}
	}
});
