// src/lib/stores/widgetConfig.ts
import { writable } from 'svelte/store';

export interface WidgetConfig {
	assistantId: string;
	name: string;
	theme: {
		textColor: string;
		primaryColor: string;
		secondaryColor: string;
		backgroundColor: string;
	};
	imageUrl: string;
	initialGreeting?: string;
}

// Default configuration
export const DEFAULT_CONFIG: WidgetConfig = {
	assistantId: '',
	name: 'Dentalflo AI Clinic',
	theme: {
		textColor: '#FFFFFF',
		primaryColor: '#6247ff',
		secondaryColor: '#92afff',
		backgroundColor: '#FFFFFF'
	},
	imageUrl: '',
	initialGreeting:
		"Welcome to Dentalflo AI Clinic! I'm your virtual assistant. How can I help you today?"
};

// Create a writable store
export const widgetConfig = writable<WidgetConfig>({ ...DEFAULT_CONFIG });

// Load configuration from local storage
export function loadConfig(assistantId: string): void {
	if (!assistantId) return;
	try {
		const storedConfig = localStorage.getItem(`widget-config-${assistantId}`);
		if (storedConfig) {
			const config = JSON.parse(storedConfig) as WidgetConfig;
			widgetConfig.set(config);
		} else {
			// Set default with the provided assistantId
			widgetConfig.set({ ...DEFAULT_CONFIG, assistantId });
		}
	} catch (error) {
		console.error('Error loading widget configuration:', error);
		widgetConfig.set({ ...DEFAULT_CONFIG, assistantId });
	}
}

// Save configuration to local storage
export function saveConfig(config: WidgetConfig): void {
	if (!config.assistantId) return;

	try {
		localStorage.setItem(`widget-config-${config.assistantId}`, JSON.stringify(config));
	} catch (error) {
		console.error('Error saving widget configuration:', error);
	}
}
