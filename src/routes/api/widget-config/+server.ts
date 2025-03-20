// src/routes/api/widget-config/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Sample clinic configurations for widget
const clinicConfig: Record<string, unknown> = {
	'123': {
		name: 'Dental Associates',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#14B8A6',
			secondaryColor: '#F3F4F6',
			backgroundColor: '#FFFFFF'
		},
		imageUrl:
			'https://img.freepik.com/free-vector/leaf-green-logo-company-gradient-design-template_698780-557.jpg?t=st=1742305338~exp=1742308938~hmac=02ede0a07cf921ed9e004337a5d27bd58689d7a39ce017d1774541b1edea041d&w=740'
	},
	'456': {
		name: 'Smile Dental',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#6366F1',
			secondaryColor: '#E5E7EB',
			backgroundColor: '#F9FAFB'
		},
		imageUrl:
			'https://img.freepik.com/free-vector/pc-monogram-logo-design-template_23-2151226765.jpg?t=st=1742305215~exp=1742308815~hmac=c3459d4a3f07b68b2a56cd67a0d0738126cbc70db933ba43675df8d932ebc917&w=740',
		initialGreeting:
			"Hello from Smile Dental! I'm here to help with any questions about our services."
	},
	'789': {
		name: 'Bright Smile Clinic',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#F59E0B',
			secondaryColor: '#F3F4F6',
			backgroundColor: '#FFFFFF'
		},
		imageUrl:
			'https://img.freepik.com/premium-vector/logo-company-business-abstract-design-template-collection_737924-2761.jpg?w=740',
		initialGreeting:
			'Welcome to Bright Smile Clinic! How may I assist you with your dental care today?'
	},
	'4a30d4a1-b7c9-47f7-a20b-18ba750f265b': {
		name: 'Dentalflo AI Clinic',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#6247ff',
			secondaryColor: '#92afff',
			backgroundColor: '#FFFFFF'
		},
		imageUrl:
			'https://lh3.googleusercontent.com/fife/ALs6j_FgI6Cl_pNgFYL2Z9nQROCbuqbM8zYKMogilTAk1RrJxpyfUwH_Wep2l_x9xCk16e8CXdsXn0Ul64bVslyaWh70yEzEbvd0fnUPPw5z6vj0Izu9BpLD_LShdrkEZRZEtkpARwPIVQXKWOBHSy1Q9mlP4fKmBs1ELnQVAlTqAQ8Qua1oc3j1DFSf6B-2hFtkJQYdQQa7kBPXh2P7qJ9dX7lyMuQ6PUAN_SmBQY4a8ev3cZ9YKdaky1sYufHXYUj1PP3UDzFi9GF_3Ir6C6Q1nKa_QCrXTq3esmpi0rxmjeMoTAhvmnNm6mHCnIFnQFGuPv_H8dAut8hNKGRvA92DK91IfQBH-PUDa2nSyJW9HtBJ_trJHP1VH1kJJbeghaRKESHu-gLjfBeWEN6WJ9rK8pPw0iqIZiiz8WUeC9PAhvEYdX1pPMxyLLf9fCs_s3AjQTy-gkreeLa-eFsdvYKI8nsP-6qxSRNyz-rFwBWUldI-rig4Xj4IFT_h5F8ayYorCaYuzoiQdDALI6hEKrv3pomtlahtd1GneiD65KcNmLcPRtufmBLydugEzVDAY3H5hQm__Bp-w1b3uOaAFV2WJUyBeb2_J-H1NzoRqZin6aeZCxxpVMoKU7IP7Zi_WPP9HvJcl8E6XrsYBD75N8KqBoZtf3ZnNwyb6BtY_giESb3KsHojnVS1EjVxr1b-Ns7KpHD_vyuLvVTDT7fXUf4XLE_RrBv_72i_UnRXTbg0iNQnZcJxujewADakrrZMUwO6T5BwNvMTdFap6b-UVeRuZyooFJAj4Fy4EWoLC5hVSsPTC_km00OolEP7WHKyaw5XRVPUkKF8-qfT5Ur_-2tVs02NM9yoMy7QLu0aBPfzOv51C0Ych6cT1wuUuXhP7bxls6jcnbbeKp4W_pX_DKf2s-JVhxecDFesBATkprIhR8fZ-4hXOvIFjeO1ljd2cA28nNhSTWNtto0dWIVvoZJ-jZcslg8OzBpEltHBdThcE8OJam-LucP_8xY98AraifXooinZ0ijeJMnQO79NjAqXZwS0dI8pbGBLlJJk043iZN4pj5QvpnU7gqfLelrN_keFvFLmu9-QxGrgHnNsYjoWPk0yxlx2l5VCFKSdzf7hr3Xj8m6ZYyoZpEVVv3AVu6WrFVNQe8aWf6jxcY20hjrIqRcR6ZNAP5Kx2GBudhWOWktfWtA7fPJkpM_bACHVLbnfOkhH2f7l6zYVEkMumcBghX9MQG8AWrCnu_gkbYE7t3onOkO7f4tQRlW5x368h5ztD_CpeTn4kHsnDJuopmM2qJq74hmjE9klXEfDS4QFosGEEzzjklpBBMsPNoQmAcsiLV0BAZ7f8lj0kATcpti9l_stXF5TvFdAUeNrmSbKWW7Lk5vjDqesnBLQ5h7c54XHrx1tA-9gsdY-LtOmuMdDPLloezq6rWaXk5dG7cbjkFQAm-dw38xod0_2M6KftF9-JAq9cKmDD4w8j8PAdUx65siz-9KjYmQUhkXSqwy2NNEbDMJ18hIXNeq7buDMUqaKVobqC44vbzz1ucwR7HC4n2WH3wpVK7HyM-rtlg_23k3wUstgTRNrFmoh1f2Ya11gYsXSnWekd1o1cgLvj04bm05fhLPyPIVlj9OWqKKtjfDok7g209dQklqi=w1920-h945',
		initialGreeting:
			"Welcome to Dentalflo AI Clinic! I'm your virtual assistant. How can I help you today?"
	}
};

// Default configuration if no assistantId is provided
const DEFAULT_CONFIG = {
	name: 'Dental Support',
	theme: {
		textColor: '#FFFFFF',
		primaryColor: '#3869fe',
		secondaryColor: '#E5E7EB',
		backgroundColor: '#FFFFFF'
	},
	imageUrl:
		'https://lh3.googleusercontent.com/fife/ALs6j_FgI6Cl_pNgFYL2Z9nQROCbuqbM8zYKMogilTAk1RrJxpyfUwH_Wep2l_x9xCk16e8CXdsXn0Ul64bVslyaWh70yEzEbvd0fnUPPw5z6vj0Izu9BpLD_LShdrkEZRZEtkpARwPIVQXKWOBHSy1Q9mlP4fKmBs1ELnQVAlTqAQ8Qua1oc3j1DFSf6B-2hFtkJQYdQQa7kBPXh2P7qJ9dX7lyMuQ6PUAN_SmBQY4a8ev3cZ9YKdaky1sYufHXYUj1PP3UDzFi9GF_3Ir6C6Q1nKa_QCrXTq3esmpi0rxmjeMoTAhvmnNm6mHCnIFnQFGuPv_H8dAut8hNKGRvA92DK91IfQBH-PUDa2nSyJW9HtBJ_trJHP1VH1kJJbeghaRKESHu-gLjfBeWEN6WJ9rK8pPw0iqIZiiz8WUeC9PAhvEYdX1pPMxyLLf9fCs_s3AjQTy-gkreeLa-eFsdvYKI8nsP-6qxSRNyz-rFwBWUldI-rig4Xj4IFT_h5F8ayYorCaYuzoiQdDALI6hEKrv3pomtlahtd1GneiD65KcNmLcPRtufmBLydugEzVDAY3H5hQm__Bp-w1b3uOaAFV2WJUyBeb2_J-H1NzoRqZin6aeZCxxpVMoKU7IP7Zi_WPP9HvJcl8E6XrsYBD75N8KqBoZtf3ZnNwyb6BtY_giESb3KsHojnVS1EjVxr1b-Ns7KpHD_vyuLvVTDT7fXUf4XLE_RrBv_72i_UnRXTbg0iNQnZcJxujewADakrrZMUwO6T5BwNvMTdFap6b-UVeRuZyooFJAj4Fy4EWoLC5hVSsPTC_km00OolEP7WHKyaw5XRVPUkKF8-qfT5Ur_-2tVs02NM9yoMy7QLu0aBPfzOv51C0Ych6cT1wuUuXhP7bxls6jcnbbeKp4W_pX_DKf2s-JVhxecDFesBATkprIhR8fZ-4hXOvIFjeO1ljd2cA28nNhSTWNtto0dWIVvoZJ-jZcslg8OzBpEltHBdThcE8OJam-LucP_8xY98AraifXooinZ0ijeJMnQO79NjAqXZwS0dI8pbGBLlJJk043iZN4pj5QvpnU7gqfLelrN_keFvFLmu9-QxGrgHnNsYjoWPk0yxlx2l5VCFKSdzf7hr3Xj8m6ZYyoZpEVVv3AVu6WrFVNQe8aWf6jxcY20hjrIqRcR6ZNAP5Kx2GBudhWOWktfWtA7fPJkpM_bACHVLbnfOkhH2f7l6zYVEkMumcBghX9MQG8AWrCnu_gkbYE7t3onOkO7f4tQRlW5x368h5ztD_CpeTn4kHsnDJuopmM2qJq74hmjE9klXEfDS4QFosGEEzzjklpBBMsPNoQmAcsiLV0BAZ7f8lj0kATcpti9l_stXF5TvFdAUeNrmSbKWW7Lk5vjDqesnBLQ5h7c54XHrx1tA-9gsdY-LtOmuMdDPLloezq6rWaXk5dG7cbjkFQAm-dw38xod0_2M6KftF9-JAq9cKmDD4w8j8PAdUx65siz-9KjYmQUhkXSqwy2NNEbDMJ18hIXNeq7buDMUqaKVobqC44vbzz1ucwR7HC4n2WH3wpVK7HyM-rtlg_23k3wUstgTRNrFmoh1f2Ya11gYsXSnWekd1o1cgLvj04bm05fhLPyPIVlj9OWqKKtjfDok7g209dQklqi=w1920-h945',
	initialGreeting: 'Hello! Im your dental assistant. How can I help you today?'
};

export const GET = (({ url }) => {
	const assistantId = url.searchParams.get('assistantId');

	if (assistantId && clinicConfig[assistantId]) {
		return json(clinicConfig[assistantId]);
	}

	return json(DEFAULT_CONFIG);
}) satisfies RequestHandler;
