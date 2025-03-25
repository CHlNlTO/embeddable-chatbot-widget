<!-- CustomizationPanel.svelte -->
<script lang="ts">
	import { widgetConfig } from '$lib/stores/widgetConfig';

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

<div class="bg-dark-primary scrollbar h-full space-y-6 overflow-y-auto p-6">
	<div class="space-y-6">
		<!-- Assistant ID -->
		<div>
			<label for="assistantId" class="mb-2 block text-xs font-medium text-white">Assistant ID</label
			>
			<input
				type="text"
				id="assistantId"
				bind:value={assistantId}
				placeholder="Enter Assistant ID to preview"
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
			<div class="mb-5">
				<label for="textColor" class="mb-2 block text-xs text-gray-300">Text Color</label>
				<div class="flex items-center gap-2">
					<input
						type="color"
						id="textColor"
						bind:value={textColor}
						class="h-8 w-8 rounded border-0 p-0"
					/>
					<input
						type="text"
						bind:value={textColor}
						class="bg-dark-tertiary border-cornflower-blue/20 focus:ring-cornflower-blue flex-1 rounded border p-2 text-xs text-white focus:ring-1 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Primary Color -->
			<div class="mb-5">
				<label for="primaryColor" class="mb-2 block text-xs text-gray-300">Primary Color</label>
				<div class="flex items-center gap-2">
					<input
						type="color"
						id="primaryColor"
						bind:value={primaryColor}
						class="h-8 w-8 rounded border-0 p-0"
					/>
					<input
						type="text"
						bind:value={primaryColor}
						class="bg-dark-tertiary border-cornflower-blue/20 focus:ring-cornflower-blue flex-1 rounded border p-2 text-xs text-white focus:ring-1 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Secondary Color -->
			<div class="mb-5">
				<label for="secondaryColor" class="mb-2 block text-xs text-gray-300">Secondary Color</label>
				<div class="flex items-center gap-2">
					<input
						type="color"
						id="secondaryColor"
						bind:value={secondaryColor}
						class="h-8 w-8 rounded border-0 p-0"
					/>
					<input
						type="text"
						bind:value={secondaryColor}
						class="bg-dark-tertiary border-cornflower-blue/20 focus:ring-cornflower-blue flex-1 rounded border p-2 text-xs text-white focus:ring-1 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Background Color -->
			<div class="mb-5">
				<label for="backgroundColor" class="mb-2 block text-xs text-gray-300"
					>Background Color</label
				>
				<div class="flex items-center gap-2">
					<input
						type="color"
						id="backgroundColor"
						bind:value={backgroundColor}
						class="h-8 w-8 rounded border-0 p-0"
					/>
					<input
						type="text"
						bind:value={backgroundColor}
						class="bg-dark-tertiary border-cornflower-blue/20 focus:ring-cornflower-blue flex-1 rounded border p-2 text-xs text-white focus:ring-1 focus:outline-none"
					/>
				</div>
			</div>
		</div>
	</div>
</div>
