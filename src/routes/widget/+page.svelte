<!-- src\routes\widget\+page.svelte -->

<script lang="ts">
	import ChatbotWidget from '$lib/components/ChatbotWidget.svelte';
	import { onMount } from 'svelte';

	const isBrowser = typeof window !== 'undefined';

	let hostDomain = '';
	let assistantId = '';
	let config = {
		name: '',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#FFFFFF', // blue-600
			secondaryColor: '#E5E7EB', // gray-200
			backgroundColor: '#FFFFFF'
		},
		imageUrl: ''
	};

	onMount(async () => {
		if (!isBrowser) return;

		const urlParams = new URLSearchParams(window.location.search);
		hostDomain = urlParams.get('domain') || '';
		assistantId = urlParams.get('assistantId') || '';

		// Parse config if provided in URL
		const configStr = urlParams.get('config');
		if (configStr) {
			try {
				const parsedConfig = JSON.parse(decodeURIComponent(configStr));
				config = { ...config, ...parsedConfig };
			} catch (e) {
				console.error('Failed to parse config:', e);
			}
		}

		if (!hostDomain && document.referrer) {
			try {
				const referrerUrl = new URL(document.referrer);
				hostDomain = referrerUrl.hostname;

				if (hostDomain) {
					const url = new URL(window.location.href);
					url.searchParams.set('domain', hostDomain);
					window.history.replaceState({}, '', url.toString());
				}
			} catch (e) {
				console.error('Failed to parse referrer:', e);
			}
		}

		window.addEventListener('message', (event) => {
			if (event.data && typeof event.data === 'object' && event.data.type === 'set-domain') {
				hostDomain = event.data.domain;
			}
		});
	});
</script>

<svelte:head>
	<title>Chat Widget</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<ChatbotWidget {hostDomain} {assistantId} {config} />
