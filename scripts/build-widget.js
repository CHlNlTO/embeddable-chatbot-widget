import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { build } from 'vite';
// import { execSync } from 'child_process';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const staticDir = path.join(rootDir, 'static');
const libDir = path.join(srcDir, 'lib');
const componentsDir = path.join(libDir, 'components');
const widgetComponentPath = path.join(componentsDir, 'ChatbotWidget.svelte');
const embedTsPath = path.join(libDir, 'embed.ts');
const tempDir = path.join(rootDir, '.widget-build-temp');

async function buildWidget() {
	console.log('🔨 Building standalone widget...');

	try {
		// Ensure temp directory exists
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir, { recursive: true });
		}

		// Step 1: Build the Svelte component to extract HTML and CSS
		console.log('📦 Building Svelte component...');

		// Create a temporary Svelte app to build the component
		const tempAppDir = path.join(tempDir, 'app');
		if (!fs.existsSync(tempAppDir)) {
			fs.mkdirSync(tempAppDir, { recursive: true });
		}

		// Copy the ChatbotWidget.svelte to the temp directory
		const tempComponentPath = path.join(tempAppDir, 'ChatbotWidget.svelte');
		fs.copyFileSync(widgetComponentPath, tempComponentPath);

		// Create a simple wrapper to render the component
		const wrapperPath = path.join(tempAppDir, 'App.svelte');
		fs.writeFileSync(
			wrapperPath,
			`
      <script>
        import ChatbotWidget from './ChatbotWidget.svelte';
      </script>

      <ChatbotWidget />
    `
		);

		// Create a main.js entry point
		const mainJsPath = path.join(tempAppDir, 'main.js');
		fs.writeFileSync(
			mainJsPath,
			`
      import App from './App.svelte';
      import '../src/app.css';

      const app = new App({
        target: document.body
      });

      export default app;
    `
		);

		// Copy the app.css file for Tailwind
		const appCssDir = path.join(tempAppDir, 'src');
		if (!fs.existsSync(appCssDir)) {
			fs.mkdirSync(appCssDir, { recursive: true });
		}
		fs.copyFileSync(path.join(srcDir, 'app.css'), path.join(appCssDir, 'app.css'));

		// Create a vite config for this temporary app
		const tempViteConfigPath = path.join(tempDir, 'vite.config.js');
		fs.writeFileSync(
			tempViteConfigPath,
			`
      import { defineConfig } from 'vite';
      import { svelte } from '@sveltejs/vite-plugin-svelte';
      import tailwindcss from '@tailwindcss/vite';

      export default defineConfig({
        plugins: [
          tailwindcss(),
          svelte()
        ],
        build: {
          outDir: '../dist',
          emptyOutDir: true
        }
      });
    `
		);

		// Create an index.html
		const indexHtmlPath = path.join(tempAppDir, 'index.html');
		fs.writeFileSync(
			indexHtmlPath,
			`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Widget Preview</title>
        </head>
        <body>
          <script type="module" src="./main.js"></script>
        </body>
      </html>
    `
		);

		// Build the temporary app
		await build({
			root: tempAppDir,
			configFile: tempViteConfigPath
		});

		// Step 2: Extract the compiled HTML and CSS
		console.log('🔍 Extracting HTML and CSS...');

		// Read the built CSS file
		const distDir = path.join(tempDir, 'dist');
		const cssFiles = fs.readdirSync(distDir).filter((file) => file.endsWith('.css'));
		const cssFilePath = path.join(distDir, cssFiles[0]);
		const compiledCss = fs.readFileSync(cssFilePath, 'utf-8');

		// Process the CSS with PostCSS to optimize it
		const optimizedCss = await postcss([autoprefixer(), cssnano()])
			.process(compiledCss, { from: undefined })
			.then((result) => result.css);

		// Create a simplified HTML structure based on the component
		const compiledHtml = `
      <div class="dental-chatbot-header">
        <h3>Dental Support</h3>
        <button class="dental-chatbot-toggle-btn" aria-label="Toggle chat">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div class="dental-chatbot-messages"></div>
      <div class="dental-chatbot-input-container">
        <input type="text" class="dental-chatbot-input" placeholder="Type your message..." aria-label="Message input" />
        <button class="dental-chatbot-send" aria-label="Send message">Send</button>
      </div>
    `;

		// Step 3: Read the embed.ts template and inject the HTML and CSS
		console.log('💉 Injecting compiled assets into embed.ts...');

		let embedTsContent = fs.readFileSync(embedTsPath, 'utf-8');

		// Replace the template markers with the compiled assets
		embedTsContent = embedTsContent.replace('/* INJECT_COMPILED_CSS */', optimizedCss);
		embedTsContent = embedTsContent.replace('<!-- INJECT_COMPILED_HTML -->', compiledHtml);

		// Write the updated embed.ts to the temp directory
		const tempEmbedTsPath = path.join(tempDir, 'embed.ts');
		fs.writeFileSync(tempEmbedTsPath, embedTsContent);

		// Step 4: Build the final embed.js with Vite
		console.log('🚀 Building final embed.js...');

		// Create a Vite config for the final build
		const embedViteConfigPath = path.join(tempDir, 'vite.embed.config.js');
		fs.writeFileSync(
			embedViteConfigPath,
			`
      import { defineConfig } from 'vite';

      export default defineConfig({
        build: {
          lib: {
            entry: './embed.ts',
            formats: ['iife'],
            name: 'ChatbotWidget',
            fileName: () => 'embed.js'
          },
          outDir: '../static',
          emptyOutDir: false,
          minify: true,
          sourcemap: true,
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
              manualChunks: undefined,
              entryFileNames: 'embed.js',
              chunkFileNames: 'embed.js',
              assetFileNames: 'embed.[ext]'
            }
          }
        }
      });
    `
		);

		// Build the final embed.js
		await build({
			root: tempDir,
			configFile: embedViteConfigPath
		});

		console.log('✅ Widget successfully built!');
		console.log(`📂 Output file: ${path.join(staticDir, 'embed.js')}`);
	} catch (error) {
		console.error('❌ Build failed:', error);
		process.exit(1);
	} finally {
		// Clean up temp directory if not in development mode
		if (process.env.NODE_ENV !== 'development') {
			console.log('🧹 Cleaning up temporary files...');
			fs.rmSync(tempDir, { recursive: true, force: true });
		}
	}
}

// Run the build process
buildWidget();
