// src/routes/api/widget-config/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock database of clinic configurations
const clinicConfigs: Record<string, unknown> = {
	'123': {
		name: 'Dental Associates',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#14B8A6', // teal-500
			secondaryColor: '#F3F4F6', // gray-100
			backgroundColor: '#FFFFFF'
		},
		imageUrl:
			'https://img.freepik.com/free-vector/leaf-green-logo-company-gradient-design-template_698780-557.jpg?t=st=1742305338~exp=1742308938~hmac=02ede0a07cf921ed9e004337a5d27bd58689d7a39ce017d1774541b1edea041d&w=740'
	},
	'456': {
		name: 'Smile Dental',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#6366F1', // indigo-500
			secondaryColor: '#E5E7EB', // gray-200
			backgroundColor: '#F9FAFB' // gray-50
		},
		imageUrl:
			'https://img.freepik.com/free-vector/pc-monogram-logo-design-template_23-2151226765.jpg?t=st=1742305215~exp=1742308815~hmac=c3459d4a3f07b68b2a56cd67a0d0738126cbc70db933ba43675df8d932ebc917&w=740'
	},
	'789': {
		name: 'Bright Smile Clinic',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#F59E0B', // amber-500
			secondaryColor: '#F3F4F6', // gray-100
			backgroundColor: '#FFFFFF'
		},
		imageUrl:
			'https://img.freepik.com/premium-vector/logo-company-business-abstract-design-template-collection_737924-2761.jpg?w=740'
	}
};

// Default configuration
const defaultConfig = {
	name: 'Dental Support',
	theme: {
		textColor: '#FFFFFF',
		primaryColor: '#3B82F6', // blue-600
		secondaryColor: '#E5E7EB', // gray-200
		backgroundColor: '#FFFFFF'
	},
	imageUrl: ''
};

export const GET: RequestHandler = async ({ url }) => {
	// Get assistantId from query parameter
	const assistantId = url.searchParams.get('assistantId');

	if (!assistantId) {
		return json(defaultConfig);
	}

	// Return the clinic configuration or default if not found
	const config = clinicConfigs[assistantId] || defaultConfig;

	return json(config);
};
