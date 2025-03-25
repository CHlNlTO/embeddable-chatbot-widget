<!-- src/routes/customize/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { widgetConfig, loadConfig, saveConfig } from '$lib/stores/widgetConfig';
	import CustomizationPanel from '$lib/components/customization/CustomizationPanel.svelte';
	import MobileCustomizationPanel from '$lib/components/customization/MobileCustomizationPanel.svelte';

	// State variables
	let previewUrl = '';
	let iframeLoaded = false;
	let iframeError = false;
	let iframeElement: HTMLIFrameElement | null = null;
	let notificationVisible = false;
	let notificationMessage = '';
	let notificationIsError = false;
	let isMobile = false;

	// Form validation
	let urlError = '';

	// Check viewport size
	function checkViewport() {
		isMobile = window.innerWidth < 768;
	}

	// When the component mounts, check for assistantId in query params
	onMount(() => {
		const assistantId = $page.url.searchParams.get('assistantId') || '';
		if (assistantId) {
			loadConfig(assistantId);
		}

		// Initialize viewport check
		checkViewport();

		// Add resize listener
		window.addEventListener('resize', checkViewport);

		return () => {
			window.removeEventListener('resize', checkViewport);
		};
	});

	// Function to validate URL
	function validateUrl(url: string): boolean {
		if (!url) {
			urlError = 'Please enter a URL';
			return false;
		}

		try {
			new URL(url);
			urlError = '';
			return true;
		} catch (e) {
			urlError = 'Please enter a valid URL';
			return false;
		}
	}

	// Function to load preview
	function loadPreview() {
		if (validateUrl(previewUrl)) {
			iframeLoaded = false;
			iframeError = false;

			// Reset iframe to force reload
			if (iframeElement) {
				setTimeout(() => {
					if (iframeElement) {
						iframeElement.src = previewUrl;
					}
				}, 50);
			}
		}
	}

	function handleIframeLoad() {
		console.log('Iframe loaded');
		iframeLoaded = true;
	}

	function handleIframeError() {
		console.error('Iframe load error occurred');
		iframeError = true;
	}

	// Save configuration
	function saveConfiguration() {
		if (!$widgetConfig.assistantId) {
			showNotification('Please enter an Assistant ID first', true);
			return;
		}

		saveConfig($widgetConfig);
		showNotification('Configuration saved successfully!');
	}

	// Copy embed script to clipboard
	function copyEmbedScript() {
		if (!$widgetConfig.assistantId) {
			showNotification('Please enter an Assistant ID first', true);
			return;
		}

		const script = `<script src="https://embeddable-chatbot-widget.vercel.app/embed.js?assistantId=${$widgetConfig.assistantId}"><\/script>`;
		navigator.clipboard.writeText(script);
		showNotification('Script copied to clipboard!');
	}

	// Show notification
	function showNotification(message: string, isError = false) {
		notificationMessage = message;
		notificationIsError = isError;
		notificationVisible = true;

		setTimeout(() => {
			notificationVisible = false;
		}, 3000);
	}
</script>

<svelte:head>
	<style>
		/* Ensure color picker shows above all other elements */
		.color-picker {
			position: relative;
		}

		.color-picker div[role='dialog'],
		.color-picker .picker-dialog,
		.color-picker .picker-wrapper {
			z-index: 9999 !important;
			position: relative;
		}

		/* Mobile specific styles */
		@media (max-width: 767px) {
			body {
				overflow-x: hidden;
			}
		}
	</style>
</svelte:head>

<div
	class="from-dark-primary via-dark-tertiary to-dark-primary flex h-screen w-full overflow-hidden bg-gradient-to-br"
>
	<!-- Sidebar - Desktop only -->
	{#if !isMobile}
		<aside class="bg-dark-primary border-cornflower-blue/20 flex h-full w-64 flex-col border-r">
			<div class="border-cornflower-blue/20 border-b p-4">
				<div class="flex items-center gap-2">
					<img src="/dentalflo-logo.png" alt="Dentalflo AI" class="mr-0 h-8 w-auto" />
					<h1 class="text-xl font-bold text-white">Dentalflo AI</h1>
				</div>
			</div>

			<!-- Desktop Customization Panel -->
			<div class="scrollbar flex-1 overflow-hidden">
				<CustomizationPanel />
			</div>
		</aside>
	{/if}

	<!-- Main Content Area -->
	<div
		class="from-dark-primary via-dark-tertiary to-dark-primary flex h-full flex-1 flex-col bg-gradient-to-br p-4 lg:p-6"
	>
		<div class="mx-auto flex h-full w-full max-w-7xl flex-col space-y-6">
			<!-- Header -->
			<header class="border-cornflower-blue/20 bg-transparent">
				<div class="container flex flex-wrap items-center justify-between gap-3">
					<h2 class="text-xl font-semibold text-white md:text-2xl">Widget Customization</h2>

					<!-- Action buttons in header -->
					<div class="flex gap-2">
						<button
							on:click={copyEmbedScript}
							class="bg-dark-tertiary hover:bg-opacity-80 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
						>
							Copy Script
						</button>
						<button
							on:click={saveConfiguration}
							class="bg-cornflower-blue hover:bg-opacity-90 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
						>
							Save
						</button>
					</div>
				</div>
			</header>

			<!-- Preview Section -->
			<div class={`flex flex-1 flex-col gap-4 overflow-hidden ${isMobile ? 'pb-0' : ''}`}>
				<div class="bg-transparent">
					<div class="flex gap-2">
						<input
							type="text"
							bind:value={previewUrl}
							placeholder="Enter website URL to preview"
							class="border-cornflower-blue/20 focus:ring-cornflower-blue m-1 flex-1 rounded-lg border bg-transparent p-2 text-sm focus:ring-2 focus:outline-none md:p-4"
						/>
						<button
							on:click={loadPreview}
							class="bg-cornflower-blue hover:bg-opacity-90 border-cornflower-blue/20 m-0.5 rounded-lg border px-3 py-1 text-white transition-colors focus:ring-2 focus:ring-white focus:outline-none md:px-4 md:py-2"
						>
							Load
						</button>
					</div>
					{#if urlError}
						<p class="mt-1 text-sm text-red-400">{urlError}</p>
					{/if}
				</div>

				<div class="border-cornflower-blue/20 relative flex-1 rounded-xl border bg-transparent">
					<!-- Preview container -->
					<div class="relative h-full w-full">
						{#if previewUrl && !urlError}
							<iframe
								bind:this={iframeElement}
								src={previewUrl}
								title="Website Preview"
								class="h-full w-full rounded-xl border-0"
								on:load={handleIframeLoad}
								on:error={handleIframeError}
								sandbox="allow-same-origin allow-scripts allow-forms"
							></iframe>

							{#if iframeError}
								<div
									class="bg-dark-primary bg-opacity-80 absolute inset-0 flex items-center justify-center"
								>
									<div
										class="bg-dark-tertiary border-cornflower-blue/20 max-w-md rounded-lg border p-6 text-center"
									>
										<h3 class="mb-4 text-xl font-bold text-white">Unable to load website</h3>
										<p class="mb-4 text-gray-300">
											The website may have content security policies that prevent it from being
											displayed in an iframe.
										</p>
									</div>
								</div>
							{/if}
						{:else}
							<div class="absolute inset-0 flex items-center justify-center">
								<div
									class="bg-dark-tertiary border-cornflower-blue/20 max-w-md rounded-lg border p-6 text-center"
								>
									<h3 class="mb-4 text-xl font-bold text-white">Enter a website URL</h3>
									<p class="mb-4 text-gray-300">
										Enter your clinic&apos;s website URL and Assistant ID to preview your site and
										chat widget.
									</p>
								</div>
							</div>
						{/if}

						<!-- Widget Overlay - Always visible on top of the iframe -->
						{#if $widgetConfig.assistantId}
							<div
								class="pointer-events-none absolute inset-0 mr-4 mb-4 flex items-end justify-end"
							>
								<iframe
									src={`/widget?assistantId=${$widgetConfig.assistantId}&config=${encodeURIComponent(JSON.stringify($widgetConfig))}`}
									title="Chatbot Widget Preview"
									class="pointer-events-auto bottom-0 h-[450px] w-[320px] border-0"
									style="background: transparent;"
								></iframe>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile Customization Panel - Fixed at bottom for mobile -->
	{#if isMobile}
		<div class="fixed right-0 bottom-0 left-0 z-40">
			<MobileCustomizationPanel />
		</div>
	{/if}

	<!-- Notification -->
	{#if notificationVisible}
		<div
			class="border-cornflower-blue/20 fixed right-4 bottom-4 z-50 rounded-lg border p-4 shadow-lg transition-opacity duration-300"
			class:bg-green-600={!notificationIsError}
			class:bg-red-600={notificationIsError}
		>
			<p>{notificationMessage}</p>
		</div>
	{/if}
</div>

<style>
	/* Add any page-specific styles here */
	@media (max-width: 767px) {
		/* Ensure enough bottom spacing for the mobile panel */
		:global(body) {
			padding-bottom: 60px;
		}
	}
</style>
