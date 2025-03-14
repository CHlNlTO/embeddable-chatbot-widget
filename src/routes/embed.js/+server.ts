import { dev } from '$app/environment';

// In development mode, we serve a simple fallback if the embed.js file hasn't been built yet
const fallbackEmbedScript = `// Development version of embed script
(() => {
  const widgetId = 'dental-chatbot-widget-iframe';

  // Create and initialize widget
  function createWidget() {
    if (document.getElementById(widgetId)) return;

    const currentDomain = window.location.hostname;
    const iframe = document.createElement('iframe');

    iframe.id = widgetId;
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.style.width = '320px';
    iframe.style.height = '450px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.overflow = 'hidden';
    iframe.style.transition = 'height 0.3s ease';

    const widgetUrl = new URL('/widget', document.currentScript?.src || window.location.href);
    widgetUrl.searchParams.set('domain', currentDomain);
    iframe.src = widgetUrl.toString();

    document.body.appendChild(iframe);
    return iframe;
  }

  const iframe = createWidget();

  window.addEventListener('message', (event) => {
    if (event.data === 'chatbot-widget-loaded') {
      console.log('Chatbot widget loaded successfully');
    }
  });

  window.ChatbotWidget = {
    open: () => {
      if (iframe) {
        iframe.style.height = '450px';
        iframe.contentWindow?.postMessage('chatbot-open', '*');
      }
    },
    close: () => {
      if (iframe) {
        iframe.style.height = '48px';
        iframe.contentWindow?.postMessage('chatbot-close', '*');
      }
    },
    toggle: () => {
      if (iframe) {
        if (iframe.style.height === '48px') {
          window.ChatbotWidget.open();
        } else {
          window.ChatbotWidget.close();
        }
      }
    },
    isOpen: () => {
      if (!iframe) return false;
      return iframe.style.height !== '48px';
    }
  };
})();`;

// In SvelteKit, we can access static files directly in dev mode
// But in production, we use the prerendered file
export async function GET() {
	let embedScript;

	// In development, we can try to access the static file directly
	// or just serve our fallback
	if (dev) {
		try {
			// Try to fetch the static embed.js file
			const response = await fetch('/embed.js');
			if (response.ok) {
				embedScript = await response.text();
			} else {
				console.warn('Using fallback embed script in development');
				embedScript = fallbackEmbedScript;
			}
		} catch (error) {
			console.error('Error fetching embed script:', error);
			embedScript = fallbackEmbedScript;
		}
	} else {
		// In production, the static file should always be available
		// Note: SvelteKit will handle this automatically with adapter-auto or
		// adapter-cloudflare, which will include static assets
		try {
			// Try to fetch the prerendered file - in production
			// this will be handled by the CDN/edge
			const response = await fetch('/embed.js');
			if (response.ok) {
				embedScript = await response.text();
			} else {
				console.error('Embed script not found in production');
				embedScript = 'console.error("Embed script not available");';
			}
		} catch (error) {
			console.error('Error fetching embed script in production:', error);
			embedScript = 'console.error("Error loading embed script");';
		}
	}

	return new Response(embedScript, {
		headers: {
			'Content-Type': 'application/javascript',
			// Add proper cache headers
			...(dev
				? { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
				: { 'Cache-Control': 'public, max-age=3600' })
		}
	});
}
