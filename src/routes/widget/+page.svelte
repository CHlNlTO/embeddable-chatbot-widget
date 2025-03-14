<script lang="ts">
	import ChatbotWidget from '$lib/components/ChatbotWidget.svelte';
	import { onMount } from 'svelte';

	const isBrowser = typeof window !== 'undefined';

	let hostDomain = '';

	onMount(() => {
		if (!isBrowser) return;

		const urlParams = new URLSearchParams(window.location.search);
		hostDomain = urlParams.get('domain') || '';

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
	<title>Dental Chat Widget</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-transparent">
	<ChatbotWidget {hostDomain} />
</div>
