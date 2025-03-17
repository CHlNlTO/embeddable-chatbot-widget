/**
 * Dental Chatbot Widget - Self-Contained Embed Script
 *
 * This script injects the chatbot widget into any website.
 * It's designed to work when placed in the <head> or at the end of the <body>.
 */

// Define the global window interface
declare global {
	interface Window {
		ChatbotWidget?: ChatbotWidgetAPI;
	}
}

// Constants
const API_URL = 'http://localhost:3000';

// ChatbotWidget API Interface
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
	timestamp: Date;
}

// Wait for DOM to be fully loaded before initializing
function initialize() {
	// Prevent multiple initializations
	if (document.getElementById('dental-chatbot-widget-container')) {
		console.warn('Dental Chatbot Widget is already initialized');
		return;
	}

	// Inject the compiled Tailwind CSS
	injectStyles();

	// Create widget DOM structure
	createWidgetDOM();

	// Initialize state and event listeners
	initializeWidget();
}

// Extract compiled Tailwind CSS classes from the Svelte component
function injectStyles() {
	const styleElement = document.createElement('style');
	styleElement.id = 'dental-chatbot-widget-styles';

	// This will be replaced with the actual compiled CSS during build
	styleElement.textContent = `
    /* INJECT_COMPILED_CSS */
  `;

	document.head.appendChild(styleElement);
}

// Create the widget DOM structure based on the Svelte component
function createWidgetDOM() {
	const container = document.createElement('div');
	container.id = 'dental-chatbot-widget-container';

	// This will be replaced with the compiled HTML structure during build
	container.innerHTML = `
    <!-- INJECT_COMPILED_HTML -->
  `;

	document.body.appendChild(container);
}

// Initialize the widget state and events
function initializeWidget() {
	let isMinimized = true;
	let userId: string = localStorage.getItem('chatbot-user-id') || generateUUID();
	let messages: ChatMessage[] = [];
	let isLoading = false;
	const hostDomain = window.location.hostname || 'unknown';

	// DOM elements
	const container = document.getElementById('dental-chatbot-widget-container');
	const header = document.querySelector('#dental-chatbot-widget-container .dental-chatbot-header');
	const messagesContainer = document.querySelector(
		'#dental-chatbot-widget-container .dental-chatbot-messages'
	);
	const inputField = document.querySelector(
		'#dental-chatbot-widget-container .dental-chatbot-input'
	) as HTMLInputElement;
	const sendButton = document.querySelector(
		'#dental-chatbot-widget-container .dental-chatbot-send'
	);

	// Initialize userId
	userId = localStorage.getItem('chatbot-user-id') || generateUUID();
	localStorage.setItem('chatbot-user-id', userId);

	// Set initial minimized state
	const savedMinimized = localStorage.getItem('chatbot-minimized');
	if (savedMinimized !== null) {
		isMinimized = JSON.parse(savedMinimized);
		if (!isMinimized) {
			openWidget();
		}
	}

	// Load saved messages
	loadMessages();

	// Setup event listeners
	if (header) {
		header.addEventListener('click', toggleWidget);
	}

	if (inputField) {
		inputField.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				sendMessage();
			}
		});
	}

	if (sendButton) {
		sendButton.addEventListener('click', sendMessage);
	}

	// Initialize global API
	window.ChatbotWidget = {
		open: openWidget,
		close: closeWidget,
		toggle: toggleWidget,
		isOpen: () => !isMinimized
	};

	// Functions
	function generateUUID(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	function loadMessages() {
		const savedMessages = localStorage.getItem('chatbot-messages');
		if (savedMessages) {
			try {
				const parsed = JSON.parse(savedMessages);
				messages = parsed.map((msg: ChatMessage) => ({
					...msg,
					timestamp: new Date(msg.timestamp)
				}));
				renderMessages();
			} catch (e) {
				console.error('Failed to parse saved messages:', e);
				messages = [];
				fetchInitialGreeting();
			}
		} else {
			fetchInitialGreeting();
		}
	}

	function saveMessages() {
		localStorage.setItem('chatbot-messages', JSON.stringify(messages));
	}

	function renderMessages() {
		if (!messagesContainer) return;

		messagesContainer.innerHTML = '';

		messages.forEach((message) => {
			const messageEl = document.createElement('div');
			messageEl.className = `dental-chatbot-message ${message.sender === 'user' ? 'dental-chatbot-message-user' : 'dental-chatbot-message-bot'}`;

			const messageText = document.createElement('div');
			messageText.textContent = message.text;

			const timestamp = document.createElement('div');
			timestamp.className = 'dental-chatbot-timestamp';
			timestamp.textContent = formatTime(message.timestamp);

			messageEl.appendChild(messageText);
			messageEl.appendChild(timestamp);

			messagesContainer.appendChild(messageEl);
		});

		scrollToBottom();
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function scrollToBottom() {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	async function sendMessage() {
		if (!inputField || !inputField.value.trim() || isLoading) return;

		const userMessage = inputField.value.trim();
		inputField.value = '';
		isLoading = true;

		const messageId = generateUUID();

		messages.push({
			id: messageId,
			sender: 'user',
			text: userMessage,
			timestamp: new Date()
		});

		renderMessages();
		saveMessages();
		showTypingIndicator();

		try {
			const response = await fetch(`${API_URL}/chat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId,
					message: userMessage,
					domain: hostDomain
				})
			});

			if (!response.ok) {
				throw new Error(`API responded with status ${response.status}`);
			}

			const data = await response.json();

			hideTypingIndicator();

			messages.push({
				id: data.id || generateUUID(),
				sender: 'bot',
				text: data.text,
				timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
			});

			renderMessages();
			saveMessages();
		} catch (error) {
			console.error('Error sending message:', error);

			hideTypingIndicator();

			messages.push({
				id: generateUUID(),
				sender: 'bot',
				text: 'Sorry, I encountered an error. Please try again later.',
				timestamp: new Date()
			});

			renderMessages();
			saveMessages();
		} finally {
			isLoading = false;
		}
	}

	function showTypingIndicator() {
		if (!messagesContainer) return;

		const typingIndicator = document.createElement('div');
		typingIndicator.className = 'dental-chatbot-typing';
		typingIndicator.id = 'dental-chatbot-typing';

		for (let i = 0; i < 3; i++) {
			const dot = document.createElement('div');
			dot.className = 'dental-chatbot-typing-dot';
			typingIndicator.appendChild(dot);
		}

		messagesContainer.appendChild(typingIndicator);
		scrollToBottom();
	}

	function hideTypingIndicator() {
		const typingIndicator = document.getElementById('dental-chatbot-typing');
		if (typingIndicator) {
			typingIndicator.remove();
		}
	}

	async function fetchInitialGreeting() {
		if (messages.length > 0) return;

		isLoading = true;
		showTypingIndicator();

		try {
			const response = await fetch(`${API_URL}/chat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId,
					message: 'hello',
					domain: hostDomain
				})
			});

			if (response.ok) {
				const data = await response.json();

				messages.push({
					id: data.id || generateUUID(),
					sender: 'bot',
					text: data.text,
					timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
				});
			} else {
				throw new Error(`API responded with status ${response.status}`);
			}
		} catch (error) {
			console.error('Error getting initial greeting:', error);

			messages.push({
				id: generateUUID(),
				sender: 'bot',
				text: `Hello! How can I help you today? You're visiting from ${hostDomain || 'an unknown domain'}.`,
				timestamp: new Date()
			});
		} finally {
			hideTypingIndicator();
			isLoading = false;
			renderMessages();
			saveMessages();
		}
	}

	function openWidget() {
		if (!container) return;

		isMinimized = false;
		container.classList.remove('dental-chatbot-minimized');
		container.classList.add('dental-chatbot-expanded');

		if (messagesContainer) {
			(messagesContainer as HTMLElement).style.display = 'block';
		}

		const inputContainer = container.querySelector('.dental-chatbot-input-container');
		if (inputContainer) {
			(inputContainer as HTMLElement).style.display = 'flex';
		}

		localStorage.setItem('chatbot-minimized', 'false');
		scrollToBottom();
	}

	function closeWidget() {
		if (!container) return;

		isMinimized = true;
		container.classList.remove('dental-chatbot-expanded');
		container.classList.add('dental-chatbot-minimized');

		if (messagesContainer) {
			(messagesContainer as HTMLElement).style.display = 'none';
		}

		const inputContainer = container.querySelector('.dental-chatbot-input-container');
		if (inputContainer) {
			(inputContainer as HTMLElement).style.display = 'none';
		}

		localStorage.setItem('chatbot-minimized', 'true');
	}

	function toggleWidget() {
		if (isMinimized) {
			openWidget();
		} else {
			closeWidget();
		}
	}

	// Automatically fetch chat history from server
	async function fetchChatHistory() {
		try {
			const response = await fetch(`${API_URL}/history/${userId}`);
			if (response.ok) {
				const data = await response.json();
				if (data.messages && data.messages.length > 0) {
					messages = data.messages.map((msg: ChatMessage) => ({
						...msg,
						timestamp: new Date(msg.timestamp)
					}));
					renderMessages();
					saveMessages();
					return true;
				}
			}
			return false;
		} catch (error) {
			console.error('Error fetching chat history:', error);
			return false;
		}
	}

	// Try to fetch history from server
	fetchChatHistory();
}

// Check if document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
	// Document already loaded, initialize immediately
	setTimeout(initialize, 1);
} else {
	// Wait for document to load
	document.addEventListener('DOMContentLoaded', initialize);
}

// Export nothing for TypeScript compatibility
export {};
