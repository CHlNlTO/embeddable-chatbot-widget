// import { dev } from '$app/environment';

// This is a simple JavaScript version of the embed script that works in browsers
const embedScript = `// This is the entry point for our embeddable widget script

const widgetId = 'chatbot-widget-iframe';

function createWidgetIframe() {
  // Check if widget already exists to prevent duplicates
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
    document.currentScript?.src || window.location.href
  );
  widgetUrl.searchParams.set('domain', currentDomain);
  iframe.src = widgetUrl.toString();

  document.body.appendChild(iframe);

  return iframe;
}

const iframe = createWidgetIframe();

window.addEventListener('message', (event) => {
  if (event.data === 'chatbot-widget-loaded') {
    console.log('Chatbot widget loaded successfully');
  }
});

const widgetAPI = {
  open: () => {
    if (iframe) {
      iframe.style.height = '450px';
      iframe.contentWindow?.postMessage('chatbot-open', '*');
    }
  },

  close: () => {
    if (iframe) {
      iframe.style.height = '48px'; // Just show the header
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

// Expose the API to the global scope
window.ChatbotWidget = widgetAPI;
`;

export async function GET() {
	return new Response(embedScript, {
		headers: {
			'Content-Type': 'application/javascript'
		}
	});
}
