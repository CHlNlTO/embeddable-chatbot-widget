import { dev } from '$app/environment';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Get directory path for the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * This server endpoint serves the embed.js file
 * During development, it tries to read from the static directory
 * In production, it should be served directly by the CDN
 */
export async function GET() {
	let embedScript: string;

	try {
		// In development, try to read the file directly from the static directory
		const staticFilePath = resolve(__dirname, '../../../static/embed.js');
		embedScript = readFileSync(staticFilePath, 'utf-8');
	} catch (error) {
		console.error('Error reading embed.js:', error);

		// Simple fallback for when the file doesn't exist yet
		embedScript = `console.error("Embed script not available. Please run 'npm run build:embed' to generate it.");`;
	}

	return new Response(embedScript, {
		headers: {
			'Content-Type': 'application/javascript',
			// Add cache headers based on environment
			...(dev
				? { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
				: { 'Cache-Control': 'public, max-age=3600' })
		}
	});
}
