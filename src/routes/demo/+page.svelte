<script lang="ts">
	import { onMount } from 'svelte';

	let scriptLoaded = false;
	let widgetOpen = false;

	onMount(() => {
		const script = document.createElement('script');
		script.src = '/embed.js';
		script.onload = () => {
			scriptLoaded = true;
		};
		document.body.appendChild(script);
	});

	function toggleWidget() {
		if (scriptLoaded && window.ChatbotWidget) {
			window.ChatbotWidget.toggle();
			widgetOpen = !widgetOpen;
		}
	}
</script>

<div class="mx-auto min-h-screen max-w-4xl p-8">
	<h1 class="mb-6 text-4xl font-bold">Chatbot Widget Demo</h1>

	<div class="prose mb-10 max-w-3xl">
		<p class="text-lg">
			This page demonstrates how the chatbot widget would appear when embedded on a customer's
			website. The widget is loaded via a script tag and appears in the bottom right corner of the
			page.
		</p>
	</div>

	<div class="mb-8 rounded-lg bg-gray-100 p-6">
		<h2 class="mb-4 text-xl font-semibold">Widget Controls</h2>
		<div class="flex gap-4">
			<button
				on:click={toggleWidget}
				class="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
			>
				{widgetOpen ? 'Close Widget' : 'Open Widget'}
			</button>
		</div>
	</div>

	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="rounded bg-white p-6 shadow-md">
			<h3 class="mb-3 text-lg font-semibold">Example Content</h3>
			<p>
				This content represents what might be on the customer's website. The chatbot widget appears
				over this content.
			</p>
		</div>

		<div class="rounded bg-white p-6 shadow-md">
			<h3 class="mb-3 text-lg font-semibold">More Content</h3>
			<p>The widget will stay in the bottom right corner as you scroll through the page content.</p>
		</div>
	</div>

	<div class="mb-8 rounded bg-white p-6 shadow-md">
		<h3 class="mb-3 text-lg font-semibold">Domain Information</h3>
		<p>
			The widget detects that it's running on: <code
				>{window?.location?.hostname || 'localhost'}</code
			>
		</p>
		<p class="mt-2 text-sm text-gray-600">
			This information is passed to the chatbot to help identify the website it's running on.
		</p>
	</div>

	<div class="space-y-6">
		{#each Array(5) as _, i}
			<div class="rounded bg-white p-6 shadow-md">
				<h3 class="mb-3 text-lg font-semibold">Sample Content {i + 1}</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a
					pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit.
				</p>
			</div>
		{/each}
	</div>
</div>

<svelte:head>
	<title>Chatbot Widget Demo</title>
</svelte:head>
