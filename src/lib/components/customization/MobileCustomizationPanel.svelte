<!-- src/lib/components/customization/MobileCustomizationPanel.svelte -->
<script lang="ts">
	import { widgetConfig } from '$lib/stores/widgetConfig';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	// Local state for form controls
	let name = $widgetConfig.name;
	let textColor = $widgetConfig.theme.textColor;
	let primaryColor = $widgetConfig.theme.primaryColor;
	let secondaryColor = $widgetConfig.theme.secondaryColor;
	let backgroundColor = $widgetConfig.theme.backgroundColor;
	let imageUrl = $widgetConfig.imageUrl;
	let initialGreeting = $widgetConfig.initialGreeting || '';
	let assistantId = $widgetConfig.assistantId;

	// Track which customization option is active
	let activeField: string | null = null;

	// Active color picker
	let activeColorPicker: string | null = null;

	// Track open modal
	let isColorPickerOpen = false;

	// Function to toggle active field (for non-color options)
	function toggleField(field: string) {
		// Close color picker if open
		if (isColorPickerOpen) {
			hideColorPickers();
			isColorPickerOpen = false;
		}

		// Toggle the field
		if (activeField === field) {
			activeField = null;
		} else {
			activeField = field;
		}
	}

	// Function to directly open color picker
	function openColorPicker(colorType: string) {
		// First close any open panels
		activeField = null;

		// Set active color picker
		activeColorPicker = colorType;
		isColorPickerOpen = true;
	}

	// Function to hide all color pickers
	function hideColorPickers() {
		activeColorPicker = null;
		isColorPickerOpen = false;
	}

	// Options for horizontal scrolling with type identification
	const options = [
		{ id: 'assistantId', label: 'Assistant ID', type: 'input' },
		{ id: 'name', label: 'Clinic Name', type: 'input' },
		{ id: 'initialGreeting', label: 'Greeting', type: 'input' },
		{ id: 'imageUrl', label: 'Logo URL', type: 'input' },
		{ id: 'textColor', label: 'Text', type: 'color' },
		{ id: 'primaryColor', label: 'Primary', type: 'color' },
		{ id: 'secondaryColor', label: 'Secondary', type: 'color' },
		{ id: 'backgroundColor', label: 'Background', type: 'color' }
	];

	// Scroll horizontally to active option
	function scrollToActive() {
		if (!activeField && !activeColorPicker) return;

		const elementId = activeField || activeColorPicker;

		setTimeout(() => {
			const activeElement = document.getElementById(`option-${elementId}`);
			if (activeElement) {
				activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
			}
		}, 50);
	}

	// Watch for active field/color changes and scroll
	$: if (activeField || activeColorPicker) {
		scrollToActive();
	}

	// Update widget config when form values change
	$: {
		$widgetConfig = {
			...$widgetConfig,
			name,
			theme: {
				textColor,
				primaryColor,
				secondaryColor,
				backgroundColor
			},
			imageUrl,
			initialGreeting,
			assistantId
		};
	}

	// Handle click outside to close color picker
	function handleOutsideClick(event: MouseEvent) {
		if (!isColorPickerOpen) return;

		const colorPicker = document.querySelector('.color-picker-panel');
		const optionButton = document.querySelector(`#option-${activeColorPicker}`);

		if (
			colorPicker &&
			!colorPicker.contains(event.target as Node) &&
			optionButton &&
			!optionButton.contains(event.target as Node)
		) {
			hideColorPickers();
		}
	}

	onMount(() => {
		// Add click handler to document
		document.addEventListener('click', handleOutsideClick);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	});
</script>

<!-- Horizontal scrolling options -->
<div
	class="bg-dark-primary border-opacity-20 border-cornflower-blue/20 relative z-40 w-full overflow-hidden border-t py-6"
>
	<div class="scrollbar-none scroll-snap-x scroll-snap-mandatory flex gap-2 overflow-x-auto px-4">
		{#each options as option}
			<button
				id={`option-${option.id}`}
				class="bg-dark-tertiary scroll-snap-center flex flex-none items-center gap-2 rounded-full px-4 py-2 text-sm whitespace-nowrap text-white transition-all duration-200 ease-out"
				class:bg-cornflower-blue={activeField === option.id || activeColorPicker === option.id}
				class:font-medium={activeField === option.id || activeColorPicker === option.id}
				class:scale-105={activeField === option.id || activeColorPicker === option.id}
				class:shadow-md={activeField === option.id || activeColorPicker === option.id}
				on:click={() =>
					option.type === 'color' ? openColorPicker(option.id) : toggleField(option.id)}
			>
				<!-- Color preview for color options -->
				{#if option.type === 'color'}
					<span
						class="border-opacity-30 inline-block h-4 w-4 rounded-full border border-white"
						style="background-color: {option.id === 'textColor'
							? textColor
							: option.id === 'primaryColor'
								? primaryColor
								: option.id === 'secondaryColor'
									? secondaryColor
									: backgroundColor}"
					>
					</span>
				{/if}
				{option.label}
			</button>
		{/each}
	</div>
</div>

<!-- Input panel that slides up (only for non-color options) -->
{#if activeField}
	<div
		class="bg-dark-tertiary border-opacity-20 border-cornflower-blue fixed right-0 bottom-14 left-0 z-50 rounded-t-xl border-t p-4 shadow-lg"
		transition:slide={{ duration: 300, easing: quintOut }}
	>
		{#if activeField === 'assistantId'}
			<div class="mb-2">
				<label for="assistantId" class="mb-2 block text-sm font-medium text-white"
					>Assistant ID</label
				>
				<input
					type="text"
					id="assistantId"
					bind:value={assistantId}
					placeholder="Enter Assistant ID"
					class="bg-opacity-20 border-opacity-30 border-cornflower-blue focus:border-cornflower-blue bg-dark-tertiary w-full rounded-md border px-2.5 py-2.5 text-white focus:outline-none"
				/>
			</div>
		{:else if activeField === 'name'}
			<div class="mb-2">
				<label for="clinicName" class="mb-2 block text-sm font-medium text-white">Clinic Name</label
				>
				<input
					type="text"
					id="clinicName"
					bind:value={name}
					placeholder="Enter Clinic Name"
					class="bg-opacity-20 border-opacity-30 border-cornflower-blue focus:border-cornflower-blue bg-dark-tertiary w-full rounded-md border px-2.5 py-2.5 text-white focus:outline-none"
				/>
			</div>
		{:else if activeField === 'initialGreeting'}
			<div class="mb-2">
				<label for="greeting" class="mb-2 block text-sm font-medium text-white"
					>Initial Greeting</label
				>
				<textarea
					id="greeting"
					bind:value={initialGreeting}
					placeholder="Enter greeting message"
					rows="3"
					class="bg-opacity-20 border-opacity-30 border-cornflower-blue focus:border-cornflower-blue bg-dark-tertiary w-full rounded-md border px-2.5 py-2.5 text-white focus:outline-none"
				></textarea>
			</div>
		{:else if activeField === 'imageUrl'}
			<div class="mb-2">
				<label for="logoUrl" class="mb-2 block text-sm font-medium text-white">Logo URL</label>
				<input
					type="text"
					id="logoUrl"
					bind:value={imageUrl}
					placeholder="Enter Logo URL"
					class="bg-opacity-20 border-opacity-30 border-cornflower-blue focus:border-cornflower-blue bg-dark-tertiary w-full rounded-md border px-2.5 py-2.5 text-white focus:outline-none"
				/>
			</div>
		{/if}

		<button
			class="bg-opacity-20 bg-dark-tertiary absolute top-3 right-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-0 text-white"
			on:click={() => (activeField = null)}
			aria-label="Close panel"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-4 w-4"
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	</div>
{/if}

<!-- Color picker panel -->
{#if isColorPickerOpen && activeColorPicker}
	<div
		class="bg-dark-tertiary border-opacity-20 border-cornflower-blue fixed right-0 bottom-14 left-0 z-50 rounded-t-xl border-t p-4 shadow-lg"
		transition:slide={{ duration: 300, easing: quintOut }}
	>
		<div class="mb-2">
			<label for="colorValue" class="mb-2 block text-sm font-medium text-white">
				{activeColorPicker === 'textColor'
					? 'Text Color'
					: activeColorPicker === 'primaryColor'
						? 'Primary Color'
						: activeColorPicker === 'secondaryColor'
							? 'Secondary Color'
							: 'Background Color'}
			</label>

			<div class="flex items-center gap-2.5">
				<input
					type="color"
					id="colorValue"
					value={activeColorPicker === 'textColor'
						? textColor
						: activeColorPicker === 'primaryColor'
							? primaryColor
							: activeColorPicker === 'secondaryColor'
								? secondaryColor
								: backgroundColor}
					on:input={(e) => {
						if (activeColorPicker === 'textColor') textColor = e.currentTarget.value;
						else if (activeColorPicker === 'primaryColor') primaryColor = e.currentTarget.value;
						else if (activeColorPicker === 'secondaryColor') secondaryColor = e.currentTarget.value;
						else if (activeColorPicker === 'backgroundColor')
							backgroundColor = e.currentTarget.value;
					}}
					class="h-10 w-[60px] cursor-pointer rounded-md border-0 bg-transparent p-0"
				/>

				<input
					type="text"
					value={activeColorPicker === 'textColor'
						? textColor
						: activeColorPicker === 'primaryColor'
							? primaryColor
							: activeColorPicker === 'secondaryColor'
								? secondaryColor
								: backgroundColor}
					on:input={(e) => {
						if (activeColorPicker === 'textColor') textColor = e.currentTarget.value;
						else if (activeColorPicker === 'primaryColor') primaryColor = e.currentTarget.value;
						else if (activeColorPicker === 'secondaryColor') secondaryColor = e.currentTarget.value;
						else if (activeColorPicker === 'backgroundColor')
							backgroundColor = e.currentTarget.value;
					}}
					class="bg-opacity-20 border-opacity-30 border-cornflower-blue focus:border-cornflower-blue bg-dark-tertiary flex-1 rounded-md border px-2.5 py-2.5 text-white focus:outline-none"
					placeholder="#RRGGBB"
				/>
			</div>
		</div>

		<button
			class="bg-opacity-20 bg-dark-tertiary absolute top-3 right-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-0 text-white"
			on:click={hideColorPickers}
			aria-label="Close color picker"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-4 w-4"
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	</div>
{/if}

<!-- Add Tailwind utility classes for scrollbar styling -->
<style>
	.scrollbar-none {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.scrollbar-none::-webkit-scrollbar {
		display: none;
	}
</style>
