// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Global widget API type definition
	interface Window {
		ChatbotWidget?: {
			open: () => void;
			close: () => void;
			toggle: () => void;
		};
	}
}

export {};
