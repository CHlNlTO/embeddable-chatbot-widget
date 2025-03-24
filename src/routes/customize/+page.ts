// src/routes/customize/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const assistantId = url.searchParams.get('assistantId') || '';

	return {
		assistantId
	};
};
