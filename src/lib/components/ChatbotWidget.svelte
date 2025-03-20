<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * Configuration and props
	 * The assistantId is used to identify the specific AI assistant configuration to use
	 * The config object contains styling and behavioral settings for the widget
	 */
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
		initialGreeting?: string;
	} = {
		name: '',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#6247ff',
			secondaryColor: '#92afff',
			backgroundColor: '#FFFFFF'
		},
		imageUrl:
			'https://lh3.googleusercontent.com/fife/ALs6j_FgI6Cl_pNgFYL2Z9nQROCbuqbM8zYKMogilTAk1RrJxpyfUwH_Wep2l_x9xCk16e8CXdsXn0Ul64bVslyaWh70yEzEbvd0fnUPPw5z6vj0Izu9BpLD_LShdrkEZRZEtkpARwPIVQXKWOBHSy1Q9mlP4fKmBs1ELnQVAlTqAQ8Qua1oc3j1DFSf6B-2hFtkJQYdQQa7kBPXh2P7qJ9dX7lyMuQ6PUAN_SmBQY4a8ev3cZ9YKdaky1sYufHXYUj1PP3UDzFi9GF_3Ir6C6Q1nKa_QCrXTq3esmpi0rxmjeMoTAhvmnNm6mHCnIFnQFGuPv_H8dAut8hNKGRvA92DK91IfQBH-PUDa2nSyJW9HtBJ_trJHP1VH1kJJbeghaRKESHu-gLjfBeWEN6WJ9rK8pPw0iqIZiiz8WUeC9PAhvEYdX1pPMxyLLf9fCs_s3AjQTy-gkreeLa-eFsdvYKI8nsP-6qxSRNyz-rFwBWUldI-rig4Xj4IFT_h5F8ayYorCaYuzoiQdDALI6hEKrv3pomtlahtd1GneiD65KcNmLcPRtufmBLydugEzVDAY3H5hQm__Bp-w1b3uOaAFV2WJUyBeb2_J-H1NzoRqZin6aeZCxxpVMoKU7IP7Zi_WPP9HvJcl8E6XrsYBD75N8KqBoZtf3ZnNwyb6BtY_giESb3KsHojnVS1EjVxr1b-Ns7KpHD_vyuLvVTDT7fXUf4XLE_RrBv_72i_UnRXTbg0iNQnZcJxujewADakrrZMUwO6T5BwNvMTdFap6b-UVeRuZyooFJAj4Fy4EWoLC5hVSsPTC_km00OolEP7WHKyaw5XRVPUkKF8-qfT5Ur_-2tVs02NM9yoMy7QLu0aBPfzOv51C0Ych6cT1wuUuXhP7bxls6jcnbbeKp4W_pX_DKf2s-JVhxecDFesBATkprIhR8fZ-4hXOvIFjeO1ljd2cA28nNhSTWNtto0dWIVvoZJ-jZcslg8OzBpEltHBdThcE8OJam-LucP_8xY98AraifXooinZ0ijeJMnQO79NjAqXZwS0dI8pbGBLlJJk043iZN4pj5QvpnU7gqfLelrN_keFvFLmu9-QxGrgHnNsYjoWPk0yxlx2l5VCFKSdzf7hr3Xj8m6ZYyoZpEVVv3AVu6WrFVNQe8aWf6jxcY20hjrIqRcR6ZNAP5Kx2GBudhWOWktfWtA7fPJkpM_bACHVLbnfOkhH2f7l6zYVEkMumcBghX9MQG8AWrCnu_gkbYE7t3onOkO7f4tQRlW5x368h5ztD_CpeTn4kHsnDJuopmM2qJq74hmjE9klXEfDS4QFosGEEzzjklpBBMsPNoQmAcsiLV0BAZ7f8lj0kATcpti9l_stXF5TvFdAUeNrmSbKWW7Lk5vjDqesnBLQ5h7c54XHrx1tA-9gsdY-LtOmuMdDPLloezq6rWaXk5dG7cbjkFQAm-dw38xod0_2M6KftF9-JAq9cKmDD4w8j8PAdUx65siz-9KjYmQUhkXSqwy2NNEbDMJ18hIXNeq7buDMUqaKVobqC44vbzz1ucwR7HC4n2WH3wpVK7HyM-rtlg_23k3wUstgTRNrFmoh1f2Ya11gYsXSnWekd1o1cgLvj04bm05fhLPyPIVlj9OWqKKtjfDok7g209dQklqi=w1920-h945',
		initialGreeting: 'Hello! How can I help you today?'
	};

	/**
	 * API and storage constants
	 * API_URL: The base URL for all backend API endpoints
	 * STORAGE_KEYS: Object containing all local storage key names used by the widget
	 */
	const API_URL = 'https://test.smsbot.dentalfloai.dev/widget';
	const STORAGE_KEYS = {
		SESSION_TOKEN: 'dentalflo-session-token',
		SESSION_ID: 'dentalflo-session-id',
		MINIMIZED: 'chatbot-minimized'
	};

	/**
	 * Message type definition
	 * Represents a single message in the chat conversation
	 * @property {string} id - Unique identifier for the message
	 * @property {string} type - Message sender type ('human', 'ai', or 'tools')
	 * @property {string} content - The text content of the message
	 * @property {Date} created_at - Timestamp when the message was created
	 */
	type Message = {
		id: string;
		type: 'human' | 'ai' | 'tools';
		content: string;
		created_at: Date;
	};

	/**
	 * State variables
	 * These reactive variables control the widget's state and appearance
	 */
	let isMinimized = false; // Whether the chat widget is collapsed
	let messages: Message[] = []; // Array of messages in the conversation
	let inputText = ''; // Current text in the input field
	let isLoading = false; // Whether the widget is currently processing a request
	let sessionToken: string | null = null; // Authentication token for the current session

	/**
	 * Helper Functions
	 */

	/**
	 * Generates a cryptographically secure UUID
	 * @returns {string} A unique identifier string
	 */
	const generateUUID = () => crypto.randomUUID();

	/**
	 * Creates a new message object with the specified type and content
	 * @param {('human'|'ai'|'tools')} type - The sender of the message
	 * @param {string} content - The text content of the message
	 * @returns {Message} A complete message object with ID and timestamp
	 */
	const createMessage = (type: 'human' | 'ai' | 'tools', content: string): Message => ({
		id: generateUUID(),
		type,
		content,
		created_at: new Date()
	});

	/**
	 * UI Interaction Functions
	 */

	/**
	 * Toggles the minimized state of the chat widget
	 * Updates localStorage with the new state and notifies the parent window if in an iframe
	 */
	function toggleMinimize() {
		isMinimized = !isMinimized;
		localStorage.setItem(STORAGE_KEYS.MINIMIZED, JSON.stringify(isMinimized));

		// Communicate with parent window if widget is in an iframe
		if (window !== window.parent) {
			window.parent.postMessage(isMinimized ? 'chatbot-minimize' : 'chatbot-expand', '*');
		}
	}

	/**
	 * Sends the current input message to the AI
	 * Adds the message to the conversation, clears the input field, and waits for a response
	 * Handles errors by displaying an error message in the chat
	 */
	async function sendMessage() {
		// Don't send empty messages or while already processing
		if (!inputText.trim() || isLoading) return;

		const userMessage = inputText.trim();
		inputText = '';
		isLoading = true;

		// Add user message to the chat immediately for responsiveness
		messages = [...messages, createMessage('human', userMessage)];

		try {
			// Send to API and wait for response
			await sendMessageToApi(userMessage);
		} catch (error) {
			console.error('Error sending message:', error);
			addErrorMessage();
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Adds an error message to the conversation when API communication fails
	 * This provides feedback to the user when something goes wrong
	 */
	function addErrorMessage() {
		messages = [
			...messages,
			createMessage('ai', 'Sorry, I encountered an error. Please try again later.')
		];
	}

	/**
	 * Session Management
	 */

	/**
	 * Initializes or restores a chat session
	 * Retrieves stored credentials, authenticates with the API, and loads message history
	 * Ensures the initial greeting is always the first message in the conversation
	 *
	 * @returns {Promise<boolean>} True if initialization was successful, false otherwise
	 */
	async function initializeChat(): Promise<boolean> {
		try {
			// Get stored credentials from localStorage
			const storedToken = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
			const storedSessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);

			// Build URL parameters for the API request
			const params = new URLSearchParams();
			params.append('assistantId', assistantId);
			if (storedSessionId) params.append('sessionId', storedSessionId);
			if (storedToken) params.append('sessionToken', storedToken);

			// Attempt to initialize with the API, with retry logic for 401 errors
			let response = await fetchWithRetry(
				`${API_URL}/start-chat?${params.toString()}`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				},
				async (resp) => {
					// Handle 401 (Unauthorized) by clearing credentials and retrying once
					if (resp.status === 401 && storedToken) {
						localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
						localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
						sessionToken = null;

						// Create new params without the invalid token
						const newParams = new URLSearchParams();
						newParams.append('assistantId', assistantId);
						if (storedSessionId) newParams.append('sessionId', storedSessionId);

						// Retry with fresh URL without the token
						return fetch(`${API_URL}/start-chat?${newParams.toString()}`, {
							method: 'GET',
							headers: { 'Content-Type': 'application/json' }
						});
					}
					return null; // No retry needed for other errors
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to initialize chat: ${response.status}`);
			}

			const data = await response.json();

			// Process session data and store credentials
			if (data.sessionToken && data.session) {
				sessionToken = data.sessionToken;
				localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, data.sessionToken);
				localStorage.setItem(STORAGE_KEYS.SESSION_ID, data.session.id);
			} else {
				console.error('Start chat response missing session token');
				return false;
			}

			// Always create the initial greeting message
			const initialGreetingMsg = getInitialGreeting();

			// Process message history from the API
			if (data.messages?.length > 0) {
				// Map API messages to our internal format
				const historyMessages = data.messages.map((msg: any) => ({
					id: msg.id || generateUUID(),
					type: msg.message.type,
					content: msg.message.content,
					created_at: new Date(msg.created_at)
				}));

				// Check if the first message is already our greeting
				// This prevents duplicate greetings when reloading an existing conversation
				const firstMessage = historyMessages[0];
				if (
					firstMessage?.type === 'ai' &&
					(firstMessage.content === initialGreetingMsg.content ||
						firstMessage.content.includes('Hello') ||
						firstMessage.content.includes('Welcome'))
				) {
					// Greeting already exists, use history as is
					messages = historyMessages;
				} else {
					// Add greeting as first message, followed by history
					// This ensures the AI always appears to initiate the conversation
					messages = [initialGreetingMsg, ...historyMessages];
				}

				return true;
			}

			// No history, just add the initial greeting
			messages = [initialGreetingMsg];
			return true;
		} catch (error) {
			console.error('Error initializing chat:', error);
			return false;
		}
	}

	/**
	 * API Communication
	 */

	/**
	 * Sends a message to the API and handles the response
	 * Automatically handles authentication errors by refreshing the session
	 *
	 * @param {string} message - The message text to send to the API
	 * @returns {Promise<void>} Resolves when the message has been sent and response received
	 * @throws {Error} If communication fails after retry attempts
	 */
	async function sendMessageToApi(message: string): Promise<void> {
		// Ensure we have a valid session token before sending
		if (!sessionToken) {
			const success = await initializeChat();
			if (!success) {
				throw new Error('Failed to initialize chat session');
			}
		}

		try {
			// Send the message to the API with retry logic for auth errors
			const response = await fetchWithRetry(
				`${API_URL}/chat`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${sessionToken}`
					},
					body: JSON.stringify({ message })
				},
				async (resp) => {
					// Handle 401 (Unauthorized) by reinitializing chat and retrying once
					if (resp.status === 401) {
						sessionToken = null;
						localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);

						await initializeChat();

						// Only retry if we successfully got a new token
						if (sessionToken) {
							return fetch(`${API_URL}/chat`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${sessionToken}`
								},
								body: JSON.stringify({ message })
							});
						}
					}
					return null; // No retry needed for other errors
				}
			);

			if (!response.ok) {
				throw new Error(`API responded with status ${response.status}`);
			}

			const data = await response.json();

			// Add bot response to chat
			messages = [...messages, createMessage('ai', data.message)];
		} catch (error) {
			console.error('Error in API communication:', error);
			throw error; // Propagate error to be handled by caller
		}
	}

	/**
	 * Utility function for fetching with a retry callback
	 * Handles the common pattern of retrying a failed request after taking corrective action
	 *
	 * @param {string} url - The URL to fetch
	 * @param {RequestInit} options - The fetch options
	 * @param {Function} retryCallback - Function that receives the failed response and returns a new fetch Promise or null
	 * @returns {Promise<Response>} The successful response or the last failed response
	 */
	async function fetchWithRetry(
		url: string,
		options: RequestInit,
		retryCallback: (response: Response) => Promise<Response | null>
	): Promise<Response> {
		// Attempt the initial fetch
		const response = await fetch(url, options);

		// If it fails, try the retry logic
		if (!response.ok) {
			const retryResponse = await retryCallback(response);
			if (retryResponse) {
				return retryResponse;
			}
		}

		// Return the original response (success or failure)
		return response;
	}

	/**
	 * Creates a message object containing the initial greeting
	 * Uses the configured greeting or constructs one with the clinic name
	 *
	 * @returns {Message} A message object containing the initial greeting
	 */
	function getInitialGreeting(): Message {
		const greeting =
			config.initialGreeting ||
			`Hello! How can I help you today? I'm the AI assistant for ${
				config.name || 'Dentalflo AI Clinic'
			}.`;

		return createMessage('ai', greeting);
	}

	/**
	 * Fetches widget configuration from the server based on assistantId
	 * Updates the local config with clinic-specific settings
	 * Ensures an initial greeting is set based on clinic name if not provided
	 *
	 * @returns {Promise<void>} Resolves when configuration is fetched
	 */
	async function fetchWidgetConfig(): Promise<void> {
		try {
			const response = await fetch(`/api/widget-config?assistantId=${assistantId}`);
			if (response.ok) {
				const configData = await response.json();

				// If the backend doesn't provide an initialGreeting, create one with the clinic name
				if (!configData.initialGreeting && configData.name) {
					configData.initialGreeting = `Hello! How can I help you today? I'm the AI assistant for ${configData.name}.`;
				}

				// Merge with the default config, allowing server values to override defaults
				config = { ...config, ...configData };
			}
		} catch (error) {
			console.error('Error fetching widget config:', error);
		}
	}

	/**
	 * Initialization
	 * This onMount lifecycle function runs when the component is first added to the DOM
	 * Sets up the widget configuration, loads any existing session, and sets up event listeners
	 */
	onMount(async () => {
		// Parse URL parameters to get configuration and assistantId
		const urlParams = new URLSearchParams(window.location.search);

		// Get assistantId from URL or use the default
		assistantId = urlParams.get('assistantId') || assistantId;

		// Parse config from URL if present
		// This allows the widget to be configured via URL parameters when embedded
		const configStr = urlParams.get('config');
		if (configStr) {
			try {
				const parsedConfig = JSON.parse(decodeURIComponent(configStr));
				config = { ...config, ...parsedConfig };
			} catch (error) {
				console.error('Failed to parse config:', error);
			}
		}

		// Fetch config from server if assistantId is set but no name is configured
		if (assistantId && (!config.name || config.name === '')) {
			await fetchWidgetConfig();
		}

		// Restore minimized state from localStorage
		const savedMinimized = localStorage.getItem(STORAGE_KEYS.MINIMIZED);
		if (savedMinimized !== null) {
			isMinimized = JSON.parse(savedMinimized);

			// Notify parent window if in an iframe
			if (window !== window.parent && isMinimized) {
				window.parent.postMessage('chatbot-minimize', '*');
			}
		}

		// Initialize chat session and load message history
		isLoading = true;
		await initializeChat();
		isLoading = false;

		// Notify parent that widget is fully loaded
		if (window.parent !== window) {
			window.parent.postMessage('chatbot-widget-loaded', '*');
		}

		// Listen for control messages from parent window
		// This allows external control of the widget's minimized state
		window.addEventListener('message', (event) => {
			if (event.data === 'chatbot-open') {
				isMinimized = false;
				localStorage.setItem(STORAGE_KEYS.MINIMIZED, 'false');
			} else if (event.data === 'chatbot-close') {
				isMinimized = true;
				localStorage.setItem(STORAGE_KEYS.MINIMIZED, 'true');
			}
		});
	});
</script>

<!--
  Main Widget Container
  The container uses conditional classes to control the widget height based on minimized state
  Styling is applied dynamically using the theme colors from the config
-->
<div
	class="chatbot-widget absolute right-0 bottom-0 z-50 flex w-auto max-w-sm min-w-xs flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300"
	class:h-full={!isMinimized}
	class:h-[54px]={isMinimized}
	style="background-color: {config.theme.backgroundColor};"
>
	<!--
	  Header Bar
	  Contains the logo, clinic name, and minimize/maximize button
	  Clicking anywhere on the header toggles the widget state
	-->
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
				<!-- Expand icon when minimized -->
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
				<!-- Minimize icon when expanded -->
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
		<!--
		  Message Container
		  Displays all messages in the conversation with proper styling
		  Scrollable when content exceeds the container height
		-->
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
						<!-- Handle multi-line messages by splitting on newlines -->
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

			<!-- Loading indicator when waiting for API response -->
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

		<!--
		  Input Area
		  Contains the message input field and send button
		  Allows users to type messages and submit via button or Enter key
		-->
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
					<!-- Loading spinner when sending a message -->
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
