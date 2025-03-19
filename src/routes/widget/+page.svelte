<!-- src/routes/widget/+page.svelte -->
<script lang="ts">
	import ChatbotWidget from '$lib/components/ChatbotWidget.svelte';
	import { onMount } from 'svelte';

	let assistantId = '';
	let config = {
		name: 'Dentalflo AI Clinic',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#6247ff', // from the palette
			secondaryColor: '#92afff', // from the palette
			backgroundColor: '#FFFFFF'
		},
		imageUrl: ''
	};

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
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
	});
</script>

<svelte:head>
	<title>Dentalflo AI Chat Widget</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<ChatbotWidget {assistantId} {config} />