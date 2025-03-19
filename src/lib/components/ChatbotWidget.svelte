<script lang="ts">
	import { onMount } from 'svelte';

	export let assistantId: string = '';
	export let config: {
		name: string;
		theme: {
			textColor: string;
			primaryColor: string;
			secondaryColor: string;
			backgroundColor: string;
		};
		imageUrl: string;
	} = {
		name: '',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#6247ff', // Default from color palette
			secondaryColor: '#92afff',
			backgroundColor: '#FFFFFF'
		},
		imageUrl: ''
	};

	// API URL for backend calls
	const API_URL = 'https://test.smsbot.dentalfloai.dev/widget';

	// Local storage keys
	const SESSION_TOKEN_STORAGE_KEY = 'dentalflo-session-token';
	const SESSION_ID = 'dentalflo-session-id';
	const MINIMIZED_STORAGE_KEY = 'chatbot-minimized';
	const MESSAGES_STORAGE_KEY = 'chatbot-messages';

	// State variables
	let isMinimized = false;
	let messages: Array<{
		id: string;
		type: 'human' | 'ai' | 'tools';
		content: string;
		created_at: Date;
	}> = [];
	let inputText = '';
	let isLoading = false;

	// Authentication credentials
	let sessionToken: string | null = null;

	function toggleMinimize() {
		isMinimized = !isMinimized;
		localStorage.setItem(MINIMIZED_STORAGE_KEY, JSON.stringify(isMinimized));

		// Communicate with parent window to also minimize the iframe
		if (window !== window.parent) {
			window.parent.postMessage(isMinimized ? 'chatbot-minimize' : 'chatbot-expand', '*');
		}
	}

	async function sendMessage() {
		if (!inputText.trim() || isLoading) return;

		const userMessage = inputText.trim();
		inputText = '';
		isLoading = true;

		const messageId = crypto.randomUUID();

		// Add user message to the chat
		messages = [
			...messages,
			{
				id: messageId,
				type: 'human',
				content: userMessage,
				created_at: new Date()
			}
		];

		// saveMessages();

		await sendMessageToApi(userMessage);
	}

	/**
	 * Send message to the API and handle the response
	 */
	async function sendMessageToApi(message: string, retryOnAuth = true) {
		try {
			// Check if we have a valid session token
			if (!sessionToken) {
				await initializeChat();
				if (!sessionToken) {
					throw new Error('Failed to initialize chat session');
				}
			}

			const response = await fetch(`${API_URL}/chat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${sessionToken}`
				},
				body: JSON.stringify({
					message
				})
			});

			if (!response.ok) {
				// If the error is due to invalid token (401) and this is our first retry
				if (response.status === 401 && retryOnAuth) {
					// Clear token and retry
					sessionToken = null;
					localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);

					// Retry the message after getting new credentials
					await initializeChat();
					return await sendMessageToApi(message, false);
				}

				throw new Error(`API responded with status ${response.status}`);
			}

			const data = await response.json();

			// Add bot response to the chat
			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					type: 'ai',
					content: data.message,
					created_at: new Date()
				}
			];

			// saveMessages();
		} catch (error) {
			console.error('Error sending message:', error);

			// Add error message to the chat
			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					type: 'ai',
					content: 'Sorry, I encountered an error. Please try again later.',
					created_at: new Date()
				}
			];

			// saveMessages();
		} finally {
			isLoading = false;
		}
	}

	// function saveMessages() {
	// 	localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
	// }

	/**
	 * Initialize chat session by calling /start-chat endpoint
	 * This will either retrieve or create new credentials and get message history
	 */
	async function initializeChat() {
		try {
			// Check localStorage for existing token and session id
			const storedToken = localStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
			const storedSessionId = localStorage.getItem(SESSION_ID);

			// Create URL with required assistantId and optional parameters only if they exist
			let url = `${API_URL}/start-chat?assistantId=${assistantId}`;
			if (storedSessionId) url += `&sessionId=${storedSessionId}`;
			if (storedToken) url += `&sessionToken=${storedToken}`;

			const headers: Record<string, string> = {
				'Content-Type': 'application/json'
			};

			const response = await fetch(url, {
				method: 'GET',
				headers,
			});

			if (!response.ok) {
				throw new Error(`Failed to initialize chat: ${response.status}`);
			}

			const data = await response.json();

			// Check if response includes session token
			if (data.sessionToken && data.session) {
				sessionToken = data.sessionToken;
				// Store token in localStorage (valid for one hour)
				localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, data.sessionToken);
				localStorage.setItem(SESSION_ID, data.session.id);
			} else {
				console.error('Start chat response missing session token');
				return false;
			}

			// Check if response includes message history
			if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
				// Convert API message format to our internal format
				messages = data.messages.map((msg: any) => ({
					id: msg.id || crypto.randomUUID(),
					type: msg.message.type,
					content: msg.message.content,
					created_at: new Date(msg.created_at)
				}));
				// saveMessages();
				return true;
			}

			// // If we successfully got token but no messages, check localStorage
			// const savedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
			// if (savedMessages) {
			// 	try {
			// 		const parsed = JSON.parse(savedMessages);
			// 		messages = parsed.map((msg: any) => ({
			// 			...msg,
			// 			created_at: new Date(msg.created_at)
			// 		}));
			// 	} catch (e) {
			// 		console.error('Failed to parse saved messages:', e);
			// 		messages = [];
			// 	}
			// }

			await sendMessageToApi('Hello!');

			return true;
		} catch (error) {
			console.error('Error initializing chat:', error);
			return false;
		}
	}

	async function fetchWidgetConfig() {
		try {
			// Get widget config from our local endpoint
			const response = await fetch(`/api/widget-config?assistantId=${assistantId}`);
			if (response.ok) {
				const configData = await response.json();
				config = { ...config, ...configData };
			}
		} catch (error) {
			console.error('Error fetching widget config:', error);
		}
	}

	onMount(async () => {
		// Parse config from URL if present
		const urlParams = new URLSearchParams(window.location.search);
		const configStr = urlParams.get('config');
		if (configStr) {
			try {
				const parsedConfig = JSON.parse(decodeURIComponent(configStr));
				config = { ...config, ...parsedConfig };
			} catch (error) {
				console.error('Failed to parse config:', error);
			}
		}

		// Get assistantId from URL
		assistantId = urlParams.get('assistantId') || assistantId;

		// If we have assistantId but no config, fetch it
		if (assistantId && (!config.name || config.name === '')) {
			await fetchWidgetConfig();
		}

		// Get minimized state from localStorage
		const savedMinimized = localStorage.getItem(MINIMIZED_STORAGE_KEY);
		if (savedMinimized !== null) {
			isMinimized = JSON.parse(savedMinimized);

			// Notify parent window of initial state
			if (window !== window.parent && isMinimized) {
				window.parent.postMessage('chatbot-minimize', '*');
			}
		}

		// Initialize chat session and get message history
		isLoading = true;
		await initializeChat();

		// If we have no messages, send an initial greeting
		if (messages.length === 0) {
			try {
				await sendMessageToApi('hello');
			} catch (error) {
				console.error('Error getting initial greeting:', error);

				// Add fallback greeting message
				messages = [
					{
						id: crypto.randomUUID(),
						type: 'ai',
						content: `Hello! How can I help you today? I'm the AI assistant for ${config.name || 'Dentalflo AI Clinic'}.`,
						created_at: new Date()
					}
				];
				// saveMessages();
				isLoading = false;
			}
		} else {
			isLoading = false;
		}

		// Notify parent window that widget is loaded
		if (window.parent !== window) {
			window.parent.postMessage('chatbot-widget-loaded', '*');
		}

		// Listen for messages from parent window
		window.addEventListener('message', (event) => {
			if (event.data === 'chatbot-open') {
				isMinimized = false;
				localStorage.setItem(MINIMIZED_STORAGE_KEY, 'false');
			} else if (event.data === 'chatbot-close') {
				isMinimized = true;
				localStorage.setItem(MINIMIZED_STORAGE_KEY, 'true');
			}
		});
	});
</script>

<div
	class="chatbot-widget absolute right-0 bottom-0 z-50 flex w-auto max-w-sm min-w-xs flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300"
	class:h-full={!isMinimized}
	class:h-[52px]={isMinimized}
	style="background-color: {config.theme.backgroundColor};"
>
	<!-- Header -->
	<div
		class="flex cursor-pointer items-center justify-between p-3 font-bold"
		on:click={toggleMinimize}
		on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleMinimize()}
		role="button"
		tabindex="0"
		style="background-color: {config.theme.primaryColor}; color: {config.theme.textColor};"
	>
		<div class="flex items-center">
			{#if config.imageUrl}
				<img
					src={config.imageUrl}
					alt="{config.name} logo"
					class="mr-2 h-8 w-8 rounded-full object-cover"
				/>
			{/if}
			<span>{config.name || 'Dentalflo AI Clinic'}</span>
		</div>
		<button class="cursor-pointer focus:outline-none" style="color: {config.theme.textColor};">
			{#if isMinimized}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
		</button>
	</div>

	{#if !isMinimized}
		<div
			class="flex-1 space-y-3 overflow-y-auto p-3"
			style="background-color: {config.theme.backgroundColor};"
		>
			{#each messages as message (message.id)}
			<div class="flex {message.type === 'human' ? 'justify-end' : 'justify-start'}">
				<div
					class="max-w-[80%] rounded-lg p-2"
					style="background-color: {message.type === 'human'
						? config.theme.primaryColor
						: config.theme.secondaryColor};
								color: {message.type === 'human' ? config.theme.textColor : '#333333'};"
				>
					{#if message.content.includes('\n')}
						{#each message.content.split('\n') as line}
							{#if line.trim() === ''}
								<br />
							{:else}
								<p>{line}</p>
							{/if}
						{/each}
					{:else}
						<p>{message.content}</p>
					{/if}
					<div class="mt-1 text-xs opacity-70">
						{message.created_at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					</div>
				</div>
			</div>
			{/each}

			{#if isLoading}
				<div class="flex justify-start">
					<div
						class="max-w-[80%] rounded-lg p-2"
						style="background-color: {config.theme.secondaryColor}; color: #333333;"
					>
						<div class="flex space-x-1">
							<div class="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
							<div class="h-2 w-2 animate-bounce rounded-full bg-gray-500 delay-100"></div>
							<div class="h-2 w-2 animate-bounce rounded-full bg-gray-500 delay-200"></div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<div
			class="flex border-t border-gray-200 p-3"
			style="background-color: {config.theme.backgroundColor};"
		>
			<input
				type="text"
				bind:value={inputText}
				placeholder="Type your message..."
				class="flex-1 rounded-l-lg border p-2 focus:outline-none"
				style="border-color: {config.theme.primaryColor};"
				on:keydown={(e) => e.key === 'Enter' && sendMessage()}
			/>
			<button
				on:click={sendMessage}
				class="rounded-r-lg p-2 text-white hover:opacity-90 focus:outline-none"
				style="background-color: {config.theme.primaryColor}; color: {config.theme.textColor};"
				disabled={isLoading}
			>
				{#if isLoading}
					<svg
						class="h-5 w-5 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				{:else}
					Send
				{/if}
			</button>
		</div>
	{/if}
</div>