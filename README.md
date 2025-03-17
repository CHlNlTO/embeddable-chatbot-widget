# Dental Chatbot Widget - Embed Script

This document explains how the embed script for the Dental Chatbot Widget is built, served, and used.

## Overview

The embed script is a small JavaScript file that can be added to any website via a simple script tag. It creates an iframe that loads the chatbot widget UI and provides an API for controlling the widget.

## Build Process

The embed script is written in TypeScript (`src/lib/embed.ts`) and compiled to JavaScript using Vite's library mode. This provides several benefits:

- **Type Safety**: We get the benefits of TypeScript during development
- **Optimized Output**: Vite minifies and optimizes the script for production
- **Single File**: The script is bundled into a single file with no dependencies
- **Source Maps**: Source maps are generated for debugging

### How It Works

1. The `build:embed` script in `package.json` runs Vite with a special configuration file `vite.embed.config.js`
2. Vite compiles and bundles `src/lib/embed.ts` into a single JavaScript file
3. The output is placed in the `static` directory, where it can be served by SvelteKit
4. The `/embed.js` endpoint serves this file to websites that include the script tag

## Development Workflow

During development:

1. Run `npm run dev` to start the SvelteKit dev server
2. Run `npm run build:embed` in a separate terminal to build the embed script
3. Any time you make changes to `src/lib/embed.ts`, run `npm run build:embed` again

During production build:

1. The `npm run build` command automatically runs `build:embed` before the main SvelteKit build

> **Important**: The `build:embed` step must run before the SvelteKit build, as the SvelteKit build process needs to include the generated embed.js file in its static assets.

## Usage on Websites

To add the chatbot widget to a website, add this script tag to the HTML:

```html
<script src="https://your-domain.com/embed.js"></script>
```

### JavaScript API

The embed script exposes a global `ChatbotWidget` object with the following methods:

- `ChatbotWidget.open()` - Expands the widget
- `ChatbotWidget.close()` - Minimizes the widget
- `ChatbotWidget.toggle()` - Toggles between expanded and minimized states
- `ChatbotWidget.isOpen()` - Returns whether the widget is currently expanded

Example usage:

```javascript
// Open the widget
document.getElementById('open-chat').addEventListener('click', function () {
	window.ChatbotWidget.open();
});

// Close the widget
document.getElementById('close-chat').addEventListener('click', function () {
	window.ChatbotWidget.close();
});
```

## Production Deployment

When deploying to Cloudflare:

1. The `build:embed` script creates the optimized embed.js file
2. This file is included in the static assets deployed to Cloudflare
3. The `/embed.js` endpoint serves the file with appropriate headers

## Troubleshooting

If the embed script is not loading properly:

1. Check that the build process completed successfully
2. Verify that `static/embed.js` exists
3. Check browser console for any errors
4. Confirm that the script tag has the correct URL

## Future Improvements

- Add version query parameter for cache busting
- Implement theme customization options
- Add analytics tracking for widget usage
- Improve error handling and fallbacks
