import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	// No SvelteKit plugins for this build
	plugins: [],

	build: {
		// Don't clear the output directory
		emptyOutDir: false,

		// Output to the static folder so it can be served
		outDir: 'static',

		// Build as a library with a single entry point
		lib: {
			entry: resolve(__dirname, 'src/lib/embed.ts'),
			formats: ['iife'], // Immediately Invoked Function Expression
			name: 'ChatbotWidget',
			fileName: () => 'embed'
		},

		// Optimize for production
		minify: process.env.NODE_ENV === 'production',

		// Create source maps
		sourcemap: true,

		// Configure Rollup to create a single file
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
