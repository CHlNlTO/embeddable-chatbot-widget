// This is the entry point for our embeddable widget script

const widgetId = 'chatbot-widget-iframe';

function createWidgetIframe() {
	if (document.getElementById(widgetId)) {
		return;
	}

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

	const widgetUrl = new URL(
		'/widget',
		(document.currentScript as HTMLScriptElement)?.src || window.location.href
	);
	widgetUrl.searchParams.set('domain', currentDomain);
	iframe.src = widgetUrl.toString();

	document.body.appendChild(iframe);

	return iframe;
}

const iframe = createWidgetIframe();

interface ChatbotWidgetAPI {
	open: () => void;
	close: () => void;
	toggle: () => void;
}

window.addEventListener('message', (event) => {
	if (event.data === 'chatbot-widget-loaded') {
		console.log('Chatbot widget loaded successfully');
	}
});

const widgetAPI: ChatbotWidgetAPI = {
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
				widgetAPI.open();
			} else {
				widgetAPI.close();
			}
		}
	}
};

declare global {
	interface Window {
		ChatbotWidget?: ChatbotWidgetAPI;
	}
}

window.ChatbotWidget = widgetAPI;

export {};
