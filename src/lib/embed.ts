/**
 * Dentalflo AI Chatbot Widget - Embeddable Script
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
const WIDGET_ID = 'dentalflo-chatbot-widget-iframe';
const DEFAULT_WIDTH = '320px';
const DEFAULT_HEIGHT = '450px';
const MINIMIZED_HEIGHT = '54px';
const DEFAULT_CONFIG: ClinicConfig = {
	name: 'Dentalflo AI Clinic',
	theme: {
		textColor: '#FFFFFF',
		primaryColor: '#6247ff',
		secondaryColor: '#92afff',
		backgroundColor: '#FFFFFF'
	},
	imageUrl:
		'https://lh3.googleusercontent.com/fife/ALs6j_FgI6Cl_pNgFYL2Z9nQROCbuqbM8zYKMogilTAk1RrJxpyfUwH_Wep2l_x9xCk16e8CXdsXn0Ul64bVslyaWh70yEzEbvd0fnUPPw5z6vj0Izu9BpLD_LShdrkEZRZEtkpARwPIVQXKWOBHSy1Q9mlP4fKmBs1ELnQVAlTqAQ8Qua1oc3j1DFSf6B-2hFtkJQYdQQa7kBPXh2P7qJ9dX7lyMuQ6PUAN_SmBQY4a8ev3cZ9YKdaky1sYufHXYUj1PP3UDzFi9GF_3Ir6C6Q1nKa_QCrXTq3esmpi0rxmjeMoTAhvmnNm6mHCnIFnQFGuPv_H8dAut8hNKGRvA92DK91IfQBH-PUDa2nSyJW9HtBJ_trJHP1VH1kJJbeghaRKESHu-gLjfBeWEN6WJ9rK8pPw0iqIZiiz8WUeC9PAhvEYdX1pPMxyLLf9fCs_s3AjQTy-gkreeLa-eFsdvYKI8nsP-6qxSRNyz-rFwBWUldI-rig4Xj4IFT_h5F8ayYorCaYuzoiQdDALI6hEKrv3pomtlahtd1GneiD65KcNmLcPRtufmBLydugEzVDAY3H5hQm__Bp-w1b3uOaAFV2WJUyBeb2_J-H1NzoRqZin6aeZCxxpVMoKU7IP7Zi_WPP9HvJcl8E6XrsYBD75N8KqBoZtf3ZnNwyb6BtY_giESb3KsHojnVS1EjVxr1b-Ns7KpHD_vyuLvVTDT7fXUf4XLE_RrBv_72i_UnRXTbg0iNQnZcJxujewADakrrZMUwO6T5BwNvMTdFap6b-UVeRuZyooFJAj4Fy4EWoLC5hVSsPTC_km00OolEP7WHKyaw5XRVPUkKF8-qfT5Ur_-2tVs02NM9yoMy7QLu0aBPfzOv51C0Ych6cT1wuUuXhP7bxls6jcnbbeKp4W_pX_DKf2s-JVhxecDFesBATkprIhR8fZ-4hXOvIFjeO1ljd2cA28nNhSTWNtto0dWIVvoZJ-jZcslg8OzBpEltHBdThcE8OJam-LucP_8xY98AraifXooinZ0ijeJMnQO79NjAqXZwS0dI8pbGBLlJJk043iZN4pj5QvpnU7gqfLelrN_keFvFLmu9-QxGrgHnNsYjoWPk0yxlx2l5VCFKSdzf7hr3Xj8m6ZYyoZpEVVv3AVu6WrFVNQe8aWf6jxcY20hjrIqRcR6ZNAP5Kx2GBudhWOWktfWtA7fPJkpM_bACHVLbnfOkhH2f7l6zYVEkMumcBghX9MQG8AWrCnu_gkbYE7t3onOkO7f4tQRlW5x368h5ztD_CpeTn4kHsnDJuopmM2qJq74hmjE9klXEfDS4QFosGEEzzjklpBBMsPNoQmAcsiLV0BAZ7f8lj0kATcpti9l_stXF5TvFdAUeNrmSbKWW7Lk5vjDqesnBLQ5h7c54XHrx1tA-9gsdY-LtOmuMdDPLloezq6rWaXk5dG7cbjkFQAm-dw38xod0_2M6KftF9-JAq9cKmDD4w8j8PAdUx65siz-9KjYmQUhkXSqwy2NNEbDMJ18hIXNeq7buDMUqaKVobqC44vbzz1ucwR7HC4n2WH3wpVK7HyM-rtlg_23k3wUstgTRNrFmoh1f2Ya11gYsXSnWekd1o1cgLvj04bm05fhLPyPIVlj9OWqKKtjfDok7g209dQklqi=w1920-h945',
	initialGreeting:
		"Welcome to Dentalflo AI Clinic! I'm your virtual assistant. How can I help you today?"
};

interface ClinicConfig {
	name: string;
	theme: {
		textColor: string;
		primaryColor: string;
		secondaryColor: string;
		backgroundColor: string;
	};
	imageUrl: string;
	initialGreeting?: string;
}

interface ChatbotWidgetAPI {
	open: () => void;
	close: () => void;
	toggle: () => void;
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
		// For widget config, we're using the local API endpoint in routes/api/widget-config
		// since this is not existing yet on the backend, but preferably this should be fetched from the backend
		// TODO: Replace with actual API endpoint
		const response = await fetch(`/api/widget-config?assistantId=${assistantId}`);

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
			console.warn('Dentalflo AI Chatbot Widget is already initialized');
			return null;
		}

		// Get current script element
		const scriptElement = getCurrentScriptElement();

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
		iframe.title = config.name || 'Dentalflo AI Clinic';
		iframe.setAttribute('aria-label', config.name || 'Dentalflo AI Clinic Chat Widget');

		// Set iframe styles
		Object.assign(iframe.style, {
			position: 'fixed',
			bottom: '16px',
			right: '16px',
			width: DEFAULT_WIDTH,
			height: DEFAULT_HEIGHT,
			border: 'none',
			zIndex: '2147483647',
			overflow: 'hidden',
			transition: 'all 0.3s ease',
			boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
			borderRadius: '8px 8px 0 0'
		});

		// Set the src with assistantId parameter and config
		const widgetUrl = new URL('/widget', scriptElement?.src || window.location.href);

		// Add parameters
		widgetUrl.searchParams.set('t', Date.now().toString());

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
		console.error('Failed to initialize Dentalflo AI Chatbot Widget:', error);
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
		// Create the iframe
		const iframe = await initializeChatbotWidget();

		// Create and expose the API
		const widgetAPI = createWidgetAPI(iframe);

		// Add the API to the global scope
		window.ChatbotWidget = widgetAPI;

		// Listen for messages from the iframe
		window.addEventListener('message', (event) => {
			if (event.data === 'chatbot-widget-loaded') {
				console.log('Dentalflo AI Chatbot Widget loaded successfully');
			}
			// Listen for minimize/expand messages from the widget
			else if (event.data === 'chatbot-minimize' && iframe) {
				iframe.style.height = MINIMIZED_HEIGHT;
			} else if (event.data === 'chatbot-expand' && iframe) {
				iframe.style.height = DEFAULT_HEIGHT;
			}
		});
	} catch (error) {
		console.error('Error initializing Dentalflo AI Chatbot Widget:', error);
	}
})();

// Export nothing for TypeScript compatibility
export {};
