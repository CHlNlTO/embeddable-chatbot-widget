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
const MINIMIZED_HEIGHT = '52px'; // Adjusted to match the new height in the component
const DEFAULT_CONFIG = {
	name: 'Dental Support',
	theme: {
		textColor: '#FFFFFF',
		primaryColor: '#FFFFFF', // blue-600
		secondaryColor: '#E5E7EB', // gray-200
		backgroundColor: '#FFFFFF'
	},
	imageUrl: ''
};

// API URL for config fetching (different from chat API)
// const WIDGET_CONFIG_API_URL = 'https://8333-158-62-6-36.ngrok-free.app';
const WIDGET_CONFIG_API_URL = 'http://localhost:3000';

// Define the clinic configuration interface
interface ClinicConfig {
	name: string;
	theme: {
		textColor: string;
		primaryColor: string;
		secondaryColor: string;
		backgroundColor: string;
	};
	imageUrl: string;
}

// Define the ChatbotWidget API Interface
interface ChatbotWidgetAPI {
	open: () => void;
	close: () => void;
	toggle: () => void;
	setTheme?: (theme: 'light' | 'dark') => void;
	isOpen: () => boolean;
}

/**
 * Extract the assistantId from either the query parameter or script attribute
 */
function getAssistantId(): string | null {
	// Try to get from script attribute
	const scriptElement = getCurrentScriptElement();
	if (scriptElement && scriptElement.getAttribute('assistantId')) {
		return scriptElement.getAttribute('assistantId');
	}

	// Try to get from URL query parameter
	if (scriptElement && scriptElement.src) {
		try {
			const scriptUrl = new URL(scriptElement.src);
			return scriptUrl.searchParams.get('assistantId');
		} catch (error) {
			console.error('Failed to parse script URL:', error);
		}
	}

	return null;
}

/**
 * Fetch widget configuration from the API
 */
async function fetchWidgetConfig(assistantId: string): Promise<ClinicConfig> {
	try {
		// For widget config, we're using a different API endpoint than the chat API
		const response = await fetch(
			`${WIDGET_CONFIG_API_URL}/widget-config?assistantId=${assistantId}`
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch widget config: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching widget configuration:', error);
		return DEFAULT_CONFIG;
	}
}

/**
 * Create and initialize the widget iframe
 */
async function initializeChatbotWidget(): Promise<HTMLIFrameElement | null> {
	try {
		// Prevent duplicates
		if (document.getElementById(WIDGET_ID)) {
			console.warn('Dental Chatbot Widget is already initialized');
			return null;
		}

		// Get current script element and domain
		const scriptElement = getCurrentScriptElement();
		const currentDomain = window.location.hostname || 'unknown';

		// Get assistantId
		const assistantId = getAssistantId();
		if (!assistantId) {
			console.warn('No assistantId provided. Widget may not function correctly.');
		}

		// Fetch widget configuration if assistantId is available
		let config = DEFAULT_CONFIG;
		if (assistantId) {
			config = await fetchWidgetConfig(assistantId);
		}

		// Create widget iframe
		const iframe = document.createElement('iframe');

		// Set iframe attributes
		iframe.id = WIDGET_ID;
		iframe.title = config.name || 'Dental Support Chat';
		iframe.setAttribute('aria-label', config.name || 'Dental Support Chat Widget');

		// Set iframe styles
		Object.assign(iframe.style, {
			position: 'fixed',
			bottom: '16px',
			right: '16px',
			width: DEFAULT_WIDTH,
			height: DEFAULT_HEIGHT,
			border: 'none',
			zIndex: '2147483647', // Max z-index value
			overflow: 'hidden',
			transition: 'all 0.3s ease',
			boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
			borderRadius: '8px 8px 0 0'
		});

		// Set the src with domain parameter and config
		const widgetUrl = new URL('/widget', scriptElement?.src || window.location.href);

		// Add domain and other parameters
		widgetUrl.searchParams.set('domain', currentDomain);
		widgetUrl.searchParams.set('t', Date.now().toString()); // Cache busting

		// Add assistantId if available
		if (assistantId) {
			widgetUrl.searchParams.set('assistantId', assistantId);
		}

		// Serialize the config and add as a parameter
		widgetUrl.searchParams.set('config', encodeURIComponent(JSON.stringify(config)));

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
(async function () {
	try {
		// Create the iframe (now async)
		const iframe = await initializeChatbotWidget();

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
			// Listen for minimize/expand messages from the widget
			else if (event.data === 'chatbot-minimize' && iframe) {
				iframe.style.height = MINIMIZED_HEIGHT;
			} else if (event.data === 'chatbot-expand' && iframe) {
				iframe.style.height = DEFAULT_HEIGHT;
			}
		});
	} catch (error) {
		console.error('Error initializing Dental Chatbot Widget:', error);
	}
})();

// Export nothing for TypeScript compatibility
export {};
