<!-- src/routes/widget/+page.svelte -->
<script lang="ts">
	import ChatbotWidget from '$lib/components/ChatbotWidget.svelte';
	import { onMount } from 'svelte';

	let assistantId = '';
	let config = {
		name: 'Dentalflo AI Clinic',
		theme: {
			textColor: '#FFFFFF',
			primaryColor: '#6247ff', // from the palette
			secondaryColor: '#92afff', // from the palette
			backgroundColor: '#FFFFFF'
		},
		imageUrl:
			'https://lh3.googleusercontent.com/fife/ALs6j_FgI6Cl_pNgFYL2Z9nQROCbuqbM8zYKMogilTAk1RrJxpyfUwH_Wep2l_x9xCk16e8CXdsXn0Ul64bVslyaWh70yEzEbvd0fnUPPw5z6vj0Izu9BpLD_LShdrkEZRZEtkpARwPIVQXKWOBHSy1Q9mlP4fKmBs1ELnQVAlTqAQ8Qua1oc3j1DFSf6B-2hFtkJQYdQQa7kBPXh2P7qJ9dX7lyMuQ6PUAN_SmBQY4a8ev3cZ9YKdaky1sYufHXYUj1PP3UDzFi9GF_3Ir6C6Q1nKa_QCrXTq3esmpi0rxmjeMoTAhvmnNm6mHCnIFnQFGuPv_H8dAut8hNKGRvA92DK91IfQBH-PUDa2nSyJW9HtBJ_trJHP1VH1kJJbeghaRKESHu-gLjfBeWEN6WJ9rK8pPw0iqIZiiz8WUeC9PAhvEYdX1pPMxyLLf9fCs_s3AjQTy-gkreeLa-eFsdvYKI8nsP-6qxSRNyz-rFwBWUldI-rig4Xj4IFT_h5F8ayYorCaYuzoiQdDALI6hEKrv3pomtlahtd1GneiD65KcNmLcPRtufmBLydugEzVDAY3H5hQm__Bp-w1b3uOaAFV2WJUyBeb2_J-H1NzoRqZin6aeZCxxpVMoKU7IP7Zi_WPP9HvJcl8E6XrsYBD75N8KqBoZtf3ZnNwyb6BtY_giESb3KsHojnVS1EjVxr1b-Ns7KpHD_vyuLvVTDT7fXUf4XLE_RrBv_72i_UnRXTbg0iNQnZcJxujewADakrrZMUwO6T5BwNvMTdFap6b-UVeRuZyooFJAj4Fy4EWoLC5hVSsPTC_km00OolEP7WHKyaw5XRVPUkKF8-qfT5Ur_-2tVs02NM9yoMy7QLu0aBPfzOv51C0Ych6cT1wuUuXhP7bxls6jcnbbeKp4W_pX_DKf2s-JVhxecDFesBATkprIhR8fZ-4hXOvIFjeO1ljd2cA28nNhSTWNtto0dWIVvoZJ-jZcslg8OzBpEltHBdThcE8OJam-LucP_8xY98AraifXooinZ0ijeJMnQO79NjAqXZwS0dI8pbGBLlJJk043iZN4pj5QvpnU7gqfLelrN_keFvFLmu9-QxGrgHnNsYjoWPk0yxlx2l5VCFKSdzf7hr3Xj8m6ZYyoZpEVVv3AVu6WrFVNQe8aWf6jxcY20hjrIqRcR6ZNAP5Kx2GBudhWOWktfWtA7fPJkpM_bACHVLbnfOkhH2f7l6zYVEkMumcBghX9MQG8AWrCnu_gkbYE7t3onOkO7f4tQRlW5x368h5ztD_CpeTn4kHsnDJuopmM2qJq74hmjE9klXEfDS4QFosGEEzzjklpBBMsPNoQmAcsiLV0BAZ7f8lj0kATcpti9l_stXF5TvFdAUeNrmSbKWW7Lk5vjDqesnBLQ5h7c54XHrx1tA-9gsdY-LtOmuMdDPLloezq6rWaXk5dG7cbjkFQAm-dw38xod0_2M6KftF9-JAq9cKmDD4w8j8PAdUx65siz-9KjYmQUhkXSqwy2NNEbDMJ18hIXNeq7buDMUqaKVobqC44vbzz1ucwR7HC4n2WH3wpVK7HyM-rtlg_23k3wUstgTRNrFmoh1f2Ya11gYsXSnWekd1o1cgLvj04bm05fhLPyPIVlj9OWqKKtjfDok7g209dQklqi=w1920-h945'
	};

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		assistantId = urlParams.get('assistantId') || '';

		// Parse config if provided in URL
		const configStr = urlParams.get('config');
		if (configStr) {
			try {
				const parsedConfig = JSON.parse(decodeURIComponent(configStr));
				config = { ...config, ...parsedConfig };
			} catch (e) {
				console.error('Failed to parse config:', e);
			}
		}
	});
</script>

<svelte:head>
	<title>Dentalflo AI Chat Widget</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<ChatbotWidget {assistantId} {config} />
