/**
 * Dental Chatbot Widget - Embeddable Script
 *
 * This script creates an iframe that loads the chatbot widget and
 * provides an API for controlling the widget.
 */

// Define the global window interface
declare global {
	interface Window {
		ChatbotWidget?: ChatbotWidgetAPI;
	}
}

// Constants
const WIDGET_ID = 'dental-chatbot-widget-iframe';
const DEFAULT_WIDTH = '320px';
const DEFAULT_HEIGHT = '450px';
const MINIMIZED_HEIGHT = '48px';

// Define the ChatbotWidget API Interface
interface ChatbotWidgetAPI {
	open: () => void;
	close: () => void;
	toggle: () => void;
	setTheme?: (theme: 'light' | 'dark') => void;
	isOpen: () => boolean;
}

/**
 * Create and initialize the widget iframe
 */
function initializeChatbotWidget(): HTMLIFrameElement | null {
	try {
		// Prevent duplicates
		if (document.getElementById(WIDGET_ID)) {
			console.warn('Dental Chatbot Widget is already initialized');
			return null;
		}

		// Get current script element and domain
		const scriptElement = getCurrentScriptElement();
		const currentDomain = window.location.hostname || 'unknown';

		// Create widget iframe
		const iframe = document.createElement('iframe');

		// Set iframe attributes
		iframe.id = WIDGET_ID;
		iframe.title = 'Dental Support Chat';
		iframe.setAttribute('aria-label', 'Dental Support Chat Widget');

		// Set iframe styles
		Object.assign(iframe.style, {
			position: 'fixed',
			bottom: '0',
			right: '0',
			width: DEFAULT_WIDTH,
			height: DEFAULT_HEIGHT,
			border: 'none',
			zIndex: '2147483647', // Max z-index value
			overflow: 'hidden',
			transition: 'all 0.3s ease',
			boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
			borderRadius: '8px 8px 0 0'
		});

		// Set the src with domain parameter
		const widgetUrl = new URL('/widget', scriptElement?.src || window.location.href);

		// Add domain and other parameters
		widgetUrl.searchParams.set('domain', currentDomain);
		widgetUrl.searchParams.set('t', Date.now().toString()); // Cache busting
		iframe.src = widgetUrl.toString();

		// Add to body
		document.body.appendChild(iframe);

		return iframe;
	} catch (error) {
		console.error('Failed to initialize Dental Chatbot Widget:', error);
		return null;
	}
}

/**
 * Get the current script element
 */
function getCurrentScriptElement(): HTMLScriptElement | null {
	// Get the current script
	if (document.currentScript) {
		return document.currentScript as HTMLScriptElement;
	}

	// Fallback for browsers that don't support currentScript
	const scripts = document.getElementsByTagName('script');
	return scripts[scripts.length - 1];
}

/**
 * Create and expose the widget API
 */
function createWidgetAPI(iframe: HTMLIFrameElement | null): ChatbotWidgetAPI {
	const api: ChatbotWidgetAPI = {
		open: () => {
			if (!iframe) return;
			iframe.style.height = DEFAULT_HEIGHT;
			iframe.contentWindow?.postMessage('chatbot-open', '*');
		},

		close: () => {
			if (!iframe) return;
			iframe.style.height = MINIMIZED_HEIGHT;
			iframe.contentWindow?.postMessage('chatbot-close', '*');
		},

		toggle: () => {
			if (!iframe) return;
			if (api.isOpen()) {
				api.close();
			} else {
				api.open();
			}
		},

		isOpen: () => {
			if (!iframe) return false;
			return iframe.style.height !== MINIMIZED_HEIGHT;
		}
	};

	return api;
}

// Initialize the widget and create API
try {
	// Create the iframe
	const iframe = initializeChatbotWidget();

	// Create and expose the API
	const widgetAPI = createWidgetAPI(iframe);

	// Add the API to the global scope
	window.ChatbotWidget = widgetAPI;

	// Listen for messages from the iframe
	window.addEventListener('message', (event) => {
		// In production, you should verify the origin
		if (event.data === 'chatbot-widget-loaded') {
			console.log('Dental Chatbot Widget loaded successfully');
		}
	});
} catch (error) {
	console.error('Error initializing Dental Chatbot Widget:', error);
}

// Export nothing for TypeScript compatibility
export {};
