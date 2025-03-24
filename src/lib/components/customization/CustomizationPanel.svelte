<!-- src/lib/components/customization/CustomizationPanel.svelte -->
<script lang="ts">
	import { widgetConfig } from '$lib/stores/widgetConfig';
	import ColorPicker from 'svelte-awesome-color-picker';

	// Local state for form controls
	let name = $widgetConfig.name;
	let textColor = $widgetConfig.theme.textColor;
	let primaryColor = $widgetConfig.theme.primaryColor;
	let secondaryColor = $widgetConfig.theme.secondaryColor;
	let backgroundColor = $widgetConfig.theme.backgroundColor;
	let imageUrl = $widgetConfig.imageUrl;
	let initialGreeting = $widgetConfig.initialGreeting || '';
	let assistantId = $widgetConfig.assistantId;

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
</script>

<div class="bg-dark-primary h-screen space-y-6 overflow-y-auto p-6">
	<div class="space-y-6">
		<!-- Assistant ID -->
		<div>
			<label for="assistantId" class="mb-2 block text-xs font-medium text-white">Assistant ID</label
			>
			<input
				type="text"
				id="assistantId"
				bind:value={assistantId}
				placeholder="Enter Assistant ID"
				class="bg-dark-tertiary border-cornflower-blue/20 focus:ring-cornflower-blue w-full rounded border p-2 text-xs text-white focus:ring-1 focus:outline-none"
			/>
		</div>

		<!-- Clinic Name -->
		<div>
			<label for="clinicName" class="mb-2 block text-xs font-medium text-white">Clinic Name</label>
			<input
				type="text"
				id="clinicName"
				bind:value={name}
				placeholder="Enter Clinic Name"
				class="bg-dark-tertiary border-cornflower-blue/20 focus:ring-cornflower-blue w-full rounded border p-2 text-xs text-white focus:ring-1 focus:outline-none"
			/>
		</div>

		<!-- Initial Greeting -->
		<div>
			<label for="greeting" class="mb-2 block text-xs font-medium text-white"
				>Initial Greeting</label
			>
			<textarea
				id="greeting"
				bind:value={initialGreeting}
				placeholder="Enter greeting message"
				rows="4"
				class="bg-dark-tertiary border-cornflower-blue/20 focus:ring-cornflower-blue w-full rounded border p-2 text-xs text-white focus:ring-1 focus:outline-none"
			></textarea>
		</div>

		<!-- Logo URL -->
		<div>
			<label for="logoUrl" class="mb-2 block text-xs font-medium text-white">Logo URL</label>
			<input
				type="text"
				id="logoUrl"
				bind:value={imageUrl}
				placeholder="Enter Logo URL"
				class="bg-dark-tertiary border-cornflower-blue/20 focus:ring-cornflower-blue w-full rounded border p-2 text-xs text-white focus:ring-1 focus:outline-none"
			/>
			<p class="mt-1 text-xs text-gray-400">Enter a direct URL to your logo.</p>
		</div>

		<!-- Theme Colors -->
		<div>
			<h3 class="mb-4 text-xs font-medium text-white">Theme Colors</h3>

			<!-- Text Color -->
			<div class="color-picker-container mb-5">
				<label class="mb-2 block text-xs text-gray-300">Text Color</label>
				<div class="flex items-center">
					<div
						class="border-cornflower-blue/20 mr-2 h-8 w-8 rounded border"
						style="background-color: {textColor}"
					></div>
					<div class="flex-1">
						<ColorPicker bind:hex={textColor} />
					</div>
				</div>
			</div>

			<!-- Primary Color -->
			<div class="color-picker-container mb-5">
				<label class="mb-2 block text-xs text-gray-300">Primary Color</label>
				<div class="flex items-center">
					<div
						class="border-cornflower-blue/20 mr-2 h-8 w-8 rounded border"
						style="background-color: {primaryColor}"
					></div>
					<div class="flex-1">
						<ColorPicker bind:hex={primaryColor} />
					</div>
				</div>
			</div>

			<!-- Secondary Color -->
			<div class="color-picker-container mb-5">
				<label class="mb-2 block text-xs text-gray-300">Secondary Color</label>
				<div class="flex items-center">
					<div
						class="border-cornflower-blue/20 mr-2 h-8 w-8 rounded border"
						style="background-color: {secondaryColor}"
					></div>
					<div class="flex-1">
						<ColorPicker bind:hex={secondaryColor} />
					</div>
				</div>
			</div>

			<!-- Background Color -->
			<div class="color-picker-container mb-5">
				<label class="mb-2 block text-xs text-gray-300">Background Color</label>
				<div class="flex items-center">
					<div
						class="border-cornflower-blue/20 mr-2 h-8 w-8 rounded border"
						style="background-color: {backgroundColor}"
					></div>
					<div class="flex-1">
						<ColorPicker bind:hex={backgroundColor} />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
