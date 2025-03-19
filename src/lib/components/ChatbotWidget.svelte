<script lang="ts">
	import { onMount } from 'svelte';

	export let hostDomain: string = '';
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
			primaryColor: '#FFFFFF', // blue-600
			secondaryColor: '#E5E7EB', // gray-200
			backgroundColor: '#FFFFFF'
		},
		imageUrl: ''
	};

	// API URL will be determined based on assistantId in a production environment
	// For development, we'll use a default
	let API_URL = 'http://localhost:3000';

	let isMinimized = false;
	let userId: string;
	let messages: Array<{ id: string; sender: 'user' | 'bot'; text: string; timestamp: Date }> = [];
	let inputText = '';
	let isLoading = false;

	function toggleMinimize() {
		isMinimized = !isMinimized;
		localStorage.setItem('chatbot-minimized', JSON.stringify(isMinimized));

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

		messages = [
			...messages,
			{
				id: messageId,
				sender: 'user',
				text: userMessage,
				timestamp: new Date()
			}
		];

		saveMessages();

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
					// assistantId
				})
			});

			if (!response.ok) {
				throw new Error(`API responded with status ${response.status}`);
			}

			const data = await response.json();

			messages = [
				...messages,
				{
					id: data.id || crypto.randomUUID(),
					sender: 'bot',
					text: data.text,
					timestamp: new Date(data.timestamp) || new Date()
				}
			];

			saveMessages();
		} catch (error) {
			console.error('Error sending message:', error);

			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					sender: 'bot',
					text: 'Sorry, I encountered an error. Please try again later.',
					timestamp: new Date()
				}
			];

			saveMessages();
		} finally {
			isLoading = false;
		}
	}

	function saveMessages() {
		localStorage.setItem('chatbot-messages', JSON.stringify(messages));
	}

	async function fetchChatHistory() {
		try {
			const response = await fetch(`${API_URL}/history/${userId}?assistantId=${assistantId}`);
			if (response.ok) {
				const data = await response.json();
				if (data.messages && data.messages.length > 0) {
					messages = data.messages.map((msg: any) => ({
						...msg,
						timestamp: new Date(msg.timestamp)
					}));
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

		// If we have an assistantId, update the API_URL
		if (assistantId) {
			// In a production environment, this might be different based on the assistantId
			// For now, we'll use the same API_URL but include the assistantId in requests
		}

		userId = localStorage.getItem('chatbot-user-id') || crypto.randomUUID();
		localStorage.setItem('chatbot-user-id', userId);

		const savedMinimized = localStorage.getItem('chatbot-minimized');
		if (savedMinimized !== null) {
			isMinimized = JSON.parse(savedMinimized);

			// Notify parent window of initial state
			if (window !== window.parent && isMinimized) {
				window.parent.postMessage('chatbot-minimize', '*');
			}
		}

		hostDomain = urlParams.get('domain') || hostDomain;

		const historyFetched = await fetchChatHistory();

		if (!historyFetched) {
			const savedMessages = localStorage.getItem('chatbot-messages');
			if (savedMessages) {
				try {
					const parsed = JSON.parse(savedMessages);
					messages = parsed.map((msg: any) => ({
						...msg,
						timestamp: new Date(msg.timestamp)
					}));
				} catch (e) {
					console.error('Failed to parse saved messages:', e);
					messages = [];
				}
			}
		}

		if (messages.length === 0) {
			try {
				isLoading = true;
				const response = await fetch(`${API_URL}/chat`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						userId,
						message: 'hello',
						domain: hostDomain,
						assistantId
					})
				});

				if (response.ok) {
					const data = await response.json();
					messages = [
						{
							id: data.id || crypto.randomUUID(),
							sender: 'bot',
							text: data.text,
							timestamp: new Date(data.timestamp) || new Date()
						}
					];
					saveMessages();
				}
			} catch (error) {
				console.error('Error getting initial greeting:', error);
				messages = [
					{
						id: crypto.randomUUID(),
						sender: 'bot',
						text: `Hello! How can I help you today? You're visiting from ${hostDomain || 'an unknown domain'}.`,
						timestamp: new Date()
					}
				];
				saveMessages();
			} finally {
				isLoading = false;
			}
		}

		if (!hostDomain && window.parent !== window) {
			try {
				hostDomain = document.referrer ? new URL(document.referrer).hostname : 'unknown';
			} catch (e) {
				console.error('Failed to get referrer domain:', e);
				hostDomain = 'unknown';
			}
		}

		if (window.parent !== window) {
			window.parent.postMessage('chatbot-widget-loaded', '*');
		}

		// Listen for messages from parent window
		window.addEventListener('message', (event) => {
			if (event.data === 'chatbot-open') {
				isMinimized = false;
				localStorage.setItem('chatbot-minimized', 'false');
			} else if (event.data === 'chatbot-close') {
				isMinimized = true;
				localStorage.setItem('chatbot-minimized', 'true');
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
			<span>{config.name}</span>
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
				<div class="flex {message.sender === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-[80%] rounded-lg p-2"
						style="background-color: {message.sender === 'user'
							? config.theme.primaryColor
							: config.theme.secondaryColor};
						       color: {message.sender === 'user' ? config.theme.textColor : '#333333'};"
					>
						<p>{message.text}</p>
						<div class="mt-1 text-xs opacity-70">
							{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
