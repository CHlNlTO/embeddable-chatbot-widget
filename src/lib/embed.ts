/**
 * Dental Chatbot Widget - Embeddable Script
 *
 * This script creates and injects the chatbot widget directly into the page
 * without using iframes. It handles all the widget functionality including
 * chat history, API communication, and UI interactions.
 */

// Define the global window interface
declare global {
	interface Window {
		ChatbotWidget?: ChatbotWidgetAPI;
	}
}

// API for controlling the widget
interface ChatbotWidgetAPI {
	open: () => void;
	close: () => void;
	toggle: () => void;
	isOpen: () => boolean;
}

// Message interface
interface ChatMessage {
	id: string;
	sender: 'user' | 'bot';
	text: string;
	timestamp: Date | string;
}

// Self-executing function to avoid global scope pollution
(() => {
	// Constants
	const WIDGET_ID = 'dental-chatbot-widget';
	const API_URL = 'https://02ef-158-62-6-36.ngrok-free.app'; // Replace with API URL in production

	// CSS styles for the widget
	const CSS = `
    #dental-chatbot-widget {
      position: fixed;
      bottom: 16px;
      right: 16px;
      width: 320px;
      max-width: 100%;
      border-radius: 8px 8px 0 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      transition: all 0.3s ease;
      background-color: white;
      height: 450px;
    }

    #dental-chatbot-widget.minimized {
      height: 48px !important;
    }

    .chatbot-header {
      background-color: #4F46E5;
      color: white;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-weight: bold;
    }

    .chatbot-toggle-button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
    }

    .chatbot-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: calc(100% - 48px);
    }

    #dental-chatbot-widget.minimized .chatbot-body {
      display: none;
    }

    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background-color: #f9fafb;
    }

    .chatbot-message {
      max-width: 80%;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 8px;
      word-break: break-word;
    }

    .chatbot-message-user {
      align-self: flex-end;
      background-color: #4F46E5;
      color: white;
    }

    .chatbot-message-bot {
      align-self: flex-start;
      background-color: #f0f0f0;
      color: #333;
    }

    .chatbot-message-time {
      font-size: 10px;
      opacity: 0.7;
      margin-top: 4px;
      text-align: right;
    }

    .chatbot-input-area {
      display: flex;
      padding: 8px;
      border-top: 1px solid #e5e7eb;
      background-color: white;
    }

    .chatbot-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      outline: none;
    }

    .chatbot-input:focus {
      border-color: #4F46E5;
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
    }

    .chatbot-send-button {
      margin-left: 8px;
      padding: 8px 16px;
      background-color: #4F46E5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .chatbot-send-button:hover {
      background-color: #4338CA;
    }

    .chatbot-send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chatbot-loading {
      display: flex;
      gap: 4px;
      padding: 8px;
      align-self: flex-start;
      background-color: #f0f0f0;
      border-radius: 8px;
    }

    .chatbot-loading-dot {
      width: 8px;
      height: 8px;
      background-color: #888;
      border-radius: 50%;
      opacity: 0.7;
    }

    .chatbot-loading-dot:nth-child(1) {
      animation: pulse 1.2s infinite;
    }

    .chatbot-loading-dot:nth-child(2) {
      animation: pulse 1.2s infinite 0.4s;
    }

    .chatbot-loading-dot:nth-child(3) {
      animation: pulse 1.2s infinite 0.8s;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.5);
        opacity: 0.5;
      }
      50% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(0.5);
        opacity: 0.5;
      }
    }
  `;

	// HTML template for the widget
	const HTML = `
    <div class="chatbot-header">
      <span>Dental Support</span>
      <button class="chatbot-toggle-button" aria-label="Toggle chat widget">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </div>
    <div class="chatbot-body">
      <div class="chatbot-messages" aria-live="polite"></div>
      <div class="chatbot-input-area">
        <input type="text" class="chatbot-input" placeholder="Type your message..." aria-label="Type your message">
        <button class="chatbot-send-button">Send</button>
      </div>
    </div>
  `;

	// Create and inject the widget styles
	const injectStyles = (): void => {
		// Check if styles already exist
		if (document.getElementById('dental-chatbot-styles')) {
			return;
		}

		const styleElement = document.createElement('style');
		styleElement.id = 'dental-chatbot-styles';
		styleElement.textContent = CSS;
		document.head.appendChild(styleElement);
	};

	// Create and inject the widget
	const createWidget = (): HTMLElement | null => {
		// Check if widget already exists
		const existingWidget = document.getElementById(WIDGET_ID);
		if (existingWidget) {
			console.warn('Dental Chatbot Widget is already initialized');
			return existingWidget;
		}

		// Create container
		const container = document.createElement('div');
		container.id = WIDGET_ID;
		container.innerHTML = HTML;
		container.setAttribute('aria-label', 'Dental Support Chat Widget');

		// Add to page
		document.body.appendChild(container);

		return container;
	};

	// Initialize the widget functionality
	const initializeWidget = (container: HTMLElement): ChatbotWidgetAPI => {
		// Get elements
		const headerElement = container.querySelector('.chatbot-header') as HTMLElement;
		const toggleButton = container.querySelector('.chatbot-toggle-button') as HTMLButtonElement;
		const messagesContainer = container.querySelector('.chatbot-messages') as HTMLElement;
		const inputElement = container.querySelector('.chatbot-input') as HTMLInputElement;
		const sendButton = container.querySelector('.chatbot-send-button') as HTMLButtonElement;

		// State
		let isMinimized = localStorage.getItem('chatbot-minimized') === 'true';
		const userId = localStorage.getItem('chatbot-user-id') || crypto.randomUUID();
		let messages: ChatMessage[] = [];
		let isLoading = false;

		// Save user ID
		localStorage.setItem('chatbot-user-id', userId);

		// Update button icon based on state
		const updateToggleIcon = (): void => {
			toggleButton.innerHTML = isMinimized
				? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'
				: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
		};

		// Toggle minimize function
		const toggleMinimize = (): void => {
			isMinimized = !isMinimized;
			container.classList.toggle('minimized', isMinimized);
			localStorage.setItem('chatbot-minimized', isMinimized.toString());
			updateToggleIcon();
		};

		// Add message to UI
		const addMessageToUI = (message: ChatMessage): void => {
			const messageElement = document.createElement('div');
			messageElement.classList.add('chatbot-message', `chatbot-message-${message.sender}`);

			const time =
				message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp);

			messageElement.innerHTML = `
        <div class="chatbot-message-content">${message.text}</div>
        <div class="chatbot-message-time">${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      `;

			messagesContainer.appendChild(messageElement);
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		};

		// Save messages to localStorage
		const saveMessages = (): void => {
			localStorage.setItem('chatbot-messages', JSON.stringify(messages));
		};

		// Show loading indicator
		const showLoading = (): HTMLElement => {
			const loadingElement = document.createElement('div');
			loadingElement.classList.add('chatbot-message', 'chatbot-message-bot', 'chatbot-loading');
			loadingElement.innerHTML = `
        <div class="chatbot-loading-dot"></div>
        <div class="chatbot-loading-dot"></div>
        <div class="chatbot-loading-dot"></div>
      `;
			messagesContainer.appendChild(loadingElement);
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
			return loadingElement;
		};

		// Remove loading indicator
		const removeLoading = (element: HTMLElement): void => {
			if (element && element.parentNode) {
				element.parentNode.removeChild(element);
			}
		};

		// Send message function
		const sendMessage = async (text: string): Promise<void> => {
			if (!text.trim() || isLoading) return;

			const userMessage: ChatMessage = {
				id: crypto.randomUUID(),
				sender: 'user',
				text: text.trim(),
				timestamp: new Date()
			};

			// Add user message
			addMessageToUI(userMessage);
			messages.push(userMessage);
			saveMessages();

			// Clear input
			inputElement.value = '';

			// Show loading
			isLoading = true;
			sendButton.disabled = true;
			const loadingElement = showLoading();

			try {
				// Send to API
				const response = await fetch(`${API_URL}/chat`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						userId,
						message: userMessage.text,
						domain: window.location.hostname || 'unknown'
					})
				});

				// Remove loading
				removeLoading(loadingElement);
				isLoading = false;
				sendButton.disabled = false;

				if (!response.ok) {
					throw new Error(`API responded with status ${response.status}`);
				}

				const data = await response.json();

				const botMessage: ChatMessage = {
					id: data.id || crypto.randomUUID(),
					sender: 'bot',
					text: data.text,
					timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
				};

				// Add bot message
				addMessageToUI(botMessage);
				messages.push(botMessage);
				saveMessages();
			} catch (error) {
				// Remove loading
				removeLoading(loadingElement);
				isLoading = false;
				sendButton.disabled = false;

				console.error('Error sending message:', error);

				const errorMessage: ChatMessage = {
					id: crypto.randomUUID(),
					sender: 'bot',
					text: 'Sorry, I encountered an error. Please try again later.',
					timestamp: new Date()
				};

				// Add error message
				addMessageToUI(errorMessage);
				messages.push(errorMessage);
				saveMessages();
			}
		};

		// Handle key press in input
		const handleInputKeyPress = (event: KeyboardEvent): void => {
			if (event.key === 'Enter') {
				sendMessage(inputElement.value);
			}
		};

		// Initialize the widget
		const initialize = async (): Promise<void> => {
			// Set initial minimized state
			container.classList.toggle('minimized', isMinimized);
			updateToggleIcon();

			try {
				// Try to fetch chat history from API
				const response = await fetch(`${API_URL}/history/${userId}`);

				if (response.ok) {
					const data = await response.json();

					if (data.messages && data.messages.length > 0) {
						// Use the server-side messages
						messages = data.messages.map((msg: ChatMessage) => ({
							...msg,
							timestamp: new Date(msg.timestamp)
						}));

						// Add to UI
						messages.forEach(addMessageToUI);
						saveMessages();
						return;
					}
				}
			} catch (error) {
				console.warn('Failed to fetch chat history from API:', error);
			}

			// If API fails, try to load from localStorage
			try {
				const savedMessages = localStorage.getItem('chatbot-messages');

				if (savedMessages) {
					const parsedMessages = JSON.parse(savedMessages);

					if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
						messages = parsedMessages.map((msg: ChatMessage) => ({
							...msg,
							timestamp: new Date(msg.timestamp)
						}));

						// Add to UI
						messages.forEach(addMessageToUI);
						return;
					}
				}
			} catch (error) {
				console.warn('Failed to load saved messages:', error);
			}

			// If no messages found, show greeting
			try {
				isLoading = true;
				sendButton.disabled = true;
				const loadingElement = showLoading();

				const response = await fetch(`${API_URL}/chat`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						userId,
						message: 'hello',
						domain: window.location.hostname || 'unknown'
					})
				});

				removeLoading(loadingElement);
				isLoading = false;
				sendButton.disabled = false;

				if (response.ok) {
					const data = await response.json();

					const botMessage: ChatMessage = {
						id: data.id || crypto.randomUUID(),
						sender: 'bot',
						text: data.text,
						timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
					};

					addMessageToUI(botMessage);
					messages.push(botMessage);
					saveMessages();
				} else {
					throw new Error(`API responded with status ${response.status}`);
				}
			} catch (error) {
				console.error('Error getting initial greeting:', error);
				isLoading = false;
				sendButton.disabled = false;

				const greetingMessage: ChatMessage = {
					id: crypto.randomUUID(),
					sender: 'bot',
					text: `Hello! How can I help you today? You're visiting from ${window.location.hostname || 'an unknown domain'}.`,
					timestamp: new Date()
				};

				addMessageToUI(greetingMessage);
				messages.push(greetingMessage);
				saveMessages();
			}
		};

		// Add event listeners
		headerElement.addEventListener('click', toggleMinimize);
		sendButton.addEventListener('click', () => sendMessage(inputElement.value));
		inputElement.addEventListener('keydown', handleInputKeyPress);

		// Initialize widget
		initialize();

		// Return widget API
		return {
			open: () => {
				if (isMinimized) {
					toggleMinimize();
				}
			},
			close: () => {
				if (!isMinimized) {
					toggleMinimize();
				}
			},
			toggle: toggleMinimize,
			isOpen: () => !isMinimized
		};
	};

	// Check if document is ready
	const documentReady = (callback: () => void): void => {
		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			setTimeout(callback, 1);
		} else {
			document.addEventListener('DOMContentLoaded', callback);
		}
	};

	// Initialize the widget when document is ready
	documentReady(() => {
		try {
			// Inject styles
			injectStyles();

			// Create widget
			const container = createWidget();

			if (container) {
				// Initialize widget functionality
				const api = initializeWidget(container);

				// Expose API globally
				window.ChatbotWidget = api;
			}
		} catch (error) {
			console.error('Error initializing Dental Chatbot Widget:', error);
		}
	});
})();

// Export nothing for TypeScript compatibility
export {};
