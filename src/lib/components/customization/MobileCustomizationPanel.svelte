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
<div class="options-container">
	<div class="options-scroll">
		{#each options as option}
			<button
				id={`option-${option.id}`}
				class="option-button"
				class:active={activeField === option.id || activeColorPicker === option.id}
				on:click={() =>
					option.type === 'color' ? openColorPicker(option.id) : toggleField(option.id)}
			>
				<!-- Color preview for color options -->
				{#if option.type === 'color'}
					<span
						class="color-preview"
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
	<div class="input-panel" transition:slide={{ duration: 300, easing: quintOut }}>
		{#if activeField === 'assistantId'}
			<div class="field-container">
				<label for="assistantId">Assistant ID</label>
				<input
					type="text"
					id="assistantId"
					bind:value={assistantId}
					placeholder="Enter Assistant ID"
				/>
			</div>
		{:else if activeField === 'name'}
			<div class="field-container">
				<label for="clinicName">Clinic Name</label>
				<input type="text" id="clinicName" bind:value={name} placeholder="Enter Clinic Name" />
			</div>
		{:else if activeField === 'initialGreeting'}
			<div class="field-container">
				<label for="greeting">Initial Greeting</label>
				<textarea
					id="greeting"
					bind:value={initialGreeting}
					placeholder="Enter greeting message"
					rows="3"
				></textarea>
			</div>
		{:else if activeField === 'imageUrl'}
			<div class="field-container">
				<label for="logoUrl">Logo URL</label>
				<input type="text" id="logoUrl" bind:value={imageUrl} placeholder="Enter Logo URL" />
			</div>
		{/if}

		<button class="close-button" on:click={() => (activeField = null)} aria-label="Close panel">
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
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	</div>
{/if}

<!-- Color picker panel -->
{#if isColorPickerOpen && activeColorPicker}
	<div class="color-picker-panel" transition:slide={{ duration: 300, easing: quintOut }}>
		<div class="field-container">
			<label for="colorValue">
				{activeColorPicker === 'textColor'
					? 'Text Color'
					: activeColorPicker === 'primaryColor'
						? 'Primary Color'
						: activeColorPicker === 'secondaryColor'
							? 'Secondary Color'
							: 'Background Color'}
			</label>

			<div class="color-picker-controls">
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
					class="color-input"
					style="width: 20%"
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
					class="text-input"
					placeholder="#RRGGBB"
				/>
			</div>
		</div>

		<button class="close-button" on:click={hideColorPickers} aria-label="Close color picker">
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
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	</div>
{/if}

<style>
	.options-container {
		width: 100%;
		overflow: hidden;
		background-color: var(--color-dark-primary);
		border-top: 1px solid rgba(83, 123, 234, 0.2);
		padding: 8px 0;
		position: relative;
		z-index: 40;
	}

	.options-scroll {
		display: flex;
		overflow-x: auto;
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE/Edge */
		gap: 8px;
		padding: 0 16px;
		scroll-snap-type: x mandatory;
	}

	.options-scroll::-webkit-scrollbar {
		display: none; /* Chrome/Safari/Opera */
	}

	.option-button {
		flex: 0 0 auto;
		padding: 8px 16px;
		background-color: var(--color-dark-tertiary);
		color: white;
		border-radius: 20px;
		font-size: 14px;
		white-space: nowrap;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 8px;
		scroll-snap-align: center;
	}

	.option-button.active {
		background-color: var(--color-cornflower-blue);
		font-weight: 500;
		transform: scale(1.05);
		box-shadow: 0 2px 8px rgba(83, 123, 234, 0.5);
	}

	.color-preview {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		display: inline-block;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.input-panel,
	.color-picker-panel {
		position: fixed;
		bottom: 56px; /* Height of the options container */
		left: 0;
		right: 0;
		background-color: var(--color-dark-tertiary);
		padding: 16px;
		border-top: 1px solid rgba(83, 123, 234, 0.2);
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
		z-index: 50;
		box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
	}

	.field-container {
		margin-bottom: 8px;
	}

	.field-container label {
		display: block;
		font-size: 14px;
		margin-bottom: 8px;
		color: white;
		font-weight: 500;
	}

	.field-container input,
	.field-container textarea {
		width: 100%;
		padding: 10px;
		background-color: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(83, 123, 234, 0.3);
		border-radius: 6px;
		color: white;
	}

	.field-container input:focus,
	.field-container textarea:focus {
		border-color: var(--color-cornflower-blue);
		outline: none;
	}

	.close-button {
		position: absolute;
		top: 12px;
		right: 12px;
		background: rgba(0, 0, 0, 0.2);
		border: none;
		color: white;
		cursor: pointer;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.color-picker-controls {
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.color-input {
		height: 40px;
		width: 60px;
		padding: 0;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		background-color: transparent;
	}

	.text-input {
		flex: 1;
		padding: 10px;
		background-color: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(83, 123, 234, 0.3);
		border-radius: 6px;
		color: white;
	}
</style>
