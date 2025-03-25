<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let scriptLoaded = false;
	let widgetOpen = false;

	onMount(() => {
		// Load the embed script dynamically for demo
		const script = document.createElement('script');
		script.src = '/embed.js?assistantId=4a30d4a1-b7c9-47f7-a20b-18ba750f265b';
		script.onload = () => {
			scriptLoaded = true;
		};
		document.body.appendChild(script);
	});

	function toggleWidget() {
		if (scriptLoaded && window.ChatbotWidget) {
			window.ChatbotWidget.toggle();
			widgetOpen = !widgetOpen;
		}
	}
</script>

<div class="font-sans text-gray-900">
	<!-- Header -->
	<header class="fixed top-0 right-0 left-0 z-50 bg-white/90 shadow-sm backdrop-blur-lg">
		<div class="container mx-auto flex items-center justify-between px-4 py-3">
			<div class="flex items-center gap-2">
				<img
					src="https://lh3.googleusercontent.com/fife/ALs6j_FgI6Cl_pNgFYL2Z9nQROCbuqbM8zYKMogilTAk1RrJxpyfUwH_Wep2l_x9xCk16e8CXdsXn0Ul64bVslyaWh70yEzEbvd0fnUPPw5z6vj0Izu9BpLD_LShdrkEZRZEtkpARwPIVQXKWOBHSy1Q9mlP4fKmBs1ELnQVAlTqAQ8Qua1oc3j1DFSf6B-2hFtkJQYdQQa7kBPXh2P7qJ9dX7lyMuQ6PUAN_SmBQY4a8ev3cZ9YKdaky1sYufHXYUj1PP3UDzFi9GF_3Ir6C6Q1nKa_QCrXTq3esmpi0rxmjeMoTAhvmnNm6mHCnIFnQFGuPv_H8dAut8hNKGRvA92DK91IfQBH-PUDa2nSyJW9HtBJ_trJHP1VH1kJJbeghaRKESHu-gLjfBeWEN6WJ9rK8pPw0iqIZiiz8WUeC9PAhvEYdX1pPMxyLLf9fCs_s3AjQTy-gkreeLa-eFsdvYKI8nsP-6qxSRNyz-rFwBWUldI-rig4Xj4IFT_h5F8ayYorCaYuzoiQdDALI6hEKrv3pomtlahtd1GneiD65KcNmLcPRtufmBLydugEzVDAY3H5hQm__Bp-w1b3uOaAFV2WJUyBeb2_J-H1NzoRqZin6aeZCxxpVMoKU7IP7Zi_WPP9HvJcl8E6XrsYBD75N8KqBoZtf3ZnNwyb6BtY_giESb3KsHojnVS1EjVxr1b-Ns7KpHD_vyuLvVTDT7fXUf4XLE_RrBv_72i_UnRXTbg0iNQnZcJxujewADakrrZMUwO6T5BwNvMTdFap6b-UVeRuZyooFJAj4Fy4EWoLC5hVSsPTC_km00OolEP7WHKyaw5XRVPUkKF8-qfT5Ur_-2tVs02NM9yoMy7QLu0aBPfzOv51C0Ych6cT1wuUuXhP7bxls6jcnbbeKp4W_pX_DKf2s-JVhxecDFesBATkprIhR8fZ-4hXOvIFjeO1ljd2cA28nNhSTWNtto0dWIVvoZJ-jZcslg8OzBpEltHBdThcE8OJam-LucP_8xY98AraifXooinZ0ijeJMnQO79NjAqXZwS0dI8pbGBLlJJk043iZN4pj5QvpnU7gqfLelrN_keFvFLmu9-QxGrgHnNsYjoWPk0yxlx2l5VCFKSdzf7hr3Xj8m6ZYyoZpEVVv3AVu6WrFVNQe8aWf6jxcY20hjrIqRcR6ZNAP5Kx2GBudhWOWktfWtA7fPJkpM_bACHVLbnfOkhH2f7l6zYVEkMumcBghX9MQG8AWrCnu_gkbYE7t3onOkO7f4tQRlW5x368h5ztD_CpeTn4kHsnDJuopmM2qJq74hmjE9klXEfDS4QFosGEEzzjklpBBMsPNoQmAcsiLV0BAZ7f8lj0kATcpti9l_stXF5TvFdAUeNrmSbKWW7Lk5vjDqesnBLQ5h7c54XHrx1tA-9gsdY-LtOmuMdDPLloezq6rWaXk5dG7cbjkFQAm-dw38xod0_2M6KftF9-JAq9cKmDD4w8j8PAdUx65siz-9KjYmQUhkXSqwy2NNEbDMJ18hIXNeq7buDMUqaKVobqC44vbzz1ucwR7HC4n2WH3wpVK7HyM-rtlg_23k3wUstgTRNrFmoh1f2Ya11gYsXSnWekd1o1cgLvj04bm05fhLPyPIVlj9OWqKKtjfDok7g209dQklqi=w1920-h945"
					alt="Dentalflo AI Clinic"
					class="h-8 w-8 rounded-full"
				/>
				<h1 class="text-xl font-bold">
					<span class="text-[#6247ff]">Dentalflo</span>
					<span class="text-[#3869fe]">AI Clinic</span>
				</h1>
			</div>
			<nav class="hidden gap-8 text-sm font-medium md:flex">
				<a href="#services" class="transition-colors hover:text-[#6247ff]">Services</a>
				<a href="#about" class="transition-colors hover:text-[#6247ff]">About</a>
				<a href="#technology" class="transition-colors hover:text-[#6247ff]">Our Technology</a>
				<a href="#testimonials" class="transition-colors hover:text-[#6247ff]">Testimonials</a>
				<a href="#contact" class="transition-colors hover:text-[#6247ff]">Contact</a>
			</nav>
			<button
				on:click={toggleWidget}
				class="rounded-full bg-[#6247ff] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7534fe]"
			>
				{widgetOpen ? 'Close Chat' : 'Chat with AI'}
			</button>
		</div>
	</header>

	<!-- Hero Section -->
	<section class="bg-gradient-to-b from-[#e6e2ff] to-white pt-32 pb-16">
		<div class="container mx-auto px-4">
			<div class="grid items-center gap-8 md:grid-cols-2">
				<div>
					<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
						AI-Powered Dental Care for Your Family
					</h1>
					<p class="mb-8 text-lg text-gray-700">
						Experience the future of dentistry with our AI-enhanced diagnosis, personalized
						treatment plans, and cutting-edge care.
					</p>
					<div class="flex flex-wrap gap-4">
						<button
							class="rounded-full bg-[#6247ff] px-6 py-3 font-medium text-white transition-colors hover:bg-[#7534fe]"
						>
							Book Appointment
						</button>
						<button
							on:click={toggleWidget}
							class="rounded-full border-2 border-[#6247ff] px-6 py-3 font-medium text-[#6247ff] transition-colors hover:bg-[#6247ff] hover:text-white"
						>
							Chat with AI Assistant
						</button>
					</div>
				</div>
				<div class="relative">
					<div class="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-[#92afff]/20"></div>
					<div class="absolute -right-5 -bottom-5 h-32 w-32 rounded-full bg-[#7534fe]/10"></div>
					<img
						src="https://berqwp-cdn.sfo3.cdn.digitaloceanspaces.com/cache/www.emergencydentistcheadle.co.uk/wp-content/uploads/2024/08/female-dentist-reviewing-dental-xray-modern-clinic-scaled-jpg.webp"
						alt="AI-powered dental care"
						class="relative z-10 h-auto w-full rounded-lg shadow-lg"
					/>
				</div>
			</div>
		</div>
	</section>

	<!-- AI Features Section -->
	<section id="technology" class="bg-white py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">AI-Powered Dental Experience</h2>
				<p class="mx-auto max-w-2xl text-gray-700">
					Our clinic leverages cutting-edge artificial intelligence to provide smarter, faster, and
					more personalized dental care.
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-3">
				<div
					class="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
				>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#92afff]/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-[#3869fe]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					</div>
					<h3 class="mb-2 text-xl font-bold">AI Diagnostics</h3>
					<p class="text-gray-700">
						Our AI imaging system can detect issues earlier with 99.7% accuracy, helping us provide
						proactive care.
					</p>
				</div>

				<div
					class="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
				>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#7534fe]/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-[#6247ff]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
							/>
						</svg>
					</div>
					<h3 class="mb-2 text-xl font-bold">Personalized Treatment</h3>
					<p class="text-gray-700">
						Our AI analyzes your dental history to create customized treatment plans that are unique
						to your needs.
					</p>
				</div>

				<div
					class="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
				>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#92afff]/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-[#3869fe]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h3 class="mb-2 text-xl font-bold">Smart Scheduling</h3>
					<p class="text-gray-700">
						Our AI assistant helps you book appointments, sends reminders, and answers your
						questions 24/7.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Services Section -->
	<section id="services" class="bg-gray-50 py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Our Services</h2>
				<p class="mx-auto max-w-2xl text-gray-700">
					We combine traditional dental expertise with cutting-edge AI technology to provide
					comprehensive care.
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<div
					class="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
				>
					<div class="flex h-48 items-center justify-center bg-[#92afff]/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-16 w-16 text-[#3869fe]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<div class="p-6">
						<h3 class="mb-2 text-xl font-bold">Preventive Care</h3>
						<p class="mb-4 text-gray-700">
							Our AI-enhanced cleanings and exams help detect problems before they start, using
							advanced imaging technology.
						</p>
						<a href="#" class="font-medium text-[#6247ff] hover:underline">Learn more →</a>
					</div>
				</div>

				<div
					class="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
				>
					<div class="flex h-48 items-center justify-center bg-[#7534fe]/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-16 w-16 text-[#6247ff]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
					<div class="p-6">
						<h3 class="mb-2 text-xl font-bold">Cosmetic Dentistry</h3>
						<p class="mb-4 text-gray-700">
							Our AI design system creates a perfect smile preview, allowing you to see results
							before treatment begins.
						</p>
						<a href="#" class="font-medium text-[#6247ff] hover:underline">Learn more →</a>
					</div>
				</div>

				<div
					class="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
				>
					<div class="flex h-48 items-center justify-center bg-[#92afff]/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-16 w-16 text-[#3869fe]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16m-7 6h7"
							/>
						</svg>
					</div>
					<div class="p-6">
						<h3 class="mb-2 text-xl font-bold">Restorative Services</h3>
						<p class="mb-4 text-gray-700">
							From AI-designed crowns to precision implants, our technology ensures perfect fit and
							optimal function.
						</p>
						<a href="#" class="font-medium text-[#6247ff] hover:underline">Learn more →</a>
					</div>
				</div>

				<div
					class="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
				>
					<div class="flex h-48 items-center justify-center bg-[#7534fe]/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-16 w-16 text-[#6247ff]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div class="p-6">
						<h3 class="mb-2 text-xl font-bold">Pediatric Dentistry</h3>
						<p class="mb-4 text-gray-700">
							Child-friendly AI tools make dental visits fun and educational while providing gentle,
							thorough care.
						</p>
						<a href="#" class="font-medium text-[#6247ff] hover:underline">Learn more →</a>
					</div>
				</div>

				<div
					class="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
				>
					<div class="flex h-48 items-center justify-center bg-[#92afff]/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-16 w-16 text-[#3869fe]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
					<div class="p-6">
						<h3 class="mb-2 text-xl font-bold">Emergency Services</h3>
						<p class="mb-4 text-gray-700">
							Our AI triage system helps us prioritize emergencies and provide fast, effective pain
							relief.
						</p>
						<a href="#" class="font-medium text-[#6247ff] hover:underline">Learn more →</a>
					</div>
				</div>

				<div
					class="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
				>
					<div class="flex h-48 items-center justify-center bg-[#7534fe]/20">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-16 w-16 text-[#6247ff]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<div class="p-6">
						<h3 class="mb-2 text-xl font-bold">Digital Consultation</h3>
						<p class="mb-4 text-gray-700">
							Chat with our AI assistant anytime for advice, or schedule a video consultation with
							our dentists.
						</p>
						<a href="#" class="font-medium text-[#6247ff] hover:underline">Learn more →</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- About Section -->
	<section id="about" class="bg-white py-16">
		<div class="container mx-auto px-4">
			<div class="grid items-center gap-12 md:grid-cols-2">
				<div class="relative">
					<div class="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-[#92afff]/20"></div>
					<img
						src="https://www.meetdandy.com/wp-content/uploads/2024/02/AI-in-dentistry-2.png"
						alt="Our modern dental clinic"
						class="relative z-10 h-auto w-full rounded-lg shadow-lg"
					/>
				</div>
				<div>
					<h2 class="mb-4 text-3xl font-bold">About Our AI-Powered Clinic</h2>
					<p class="mb-6 text-gray-700">
						At Dentalflo AI Clinic, we're pioneering the future of dental care. Our practice
						combines the expertise of skilled dentists with cutting-edge artificial intelligence to
						deliver a dental experience unlike any other.
					</p>
					<p class="mb-6 text-gray-700">
						Founded in 2023, our mission is to make advanced dental care more accessible, efficient,
						and personalized. Our AI systems learn from each patient interaction, continuously
						improving to provide the most accurate diagnoses and effective treatments.
					</p>
					<p class="mb-6 text-gray-700">
						Our team includes not only experienced dental professionals but also AI specialists and
						software engineers who work together to push the boundaries of what's possible in dental
						medicine.
					</p>
					<button
						class="rounded-full bg-[#6247ff] px-6 py-3 font-medium text-white transition-colors hover:bg-[#7534fe]"
					>
						Meet Our Team
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials Section -->
	<section id="testimonials" class="bg-gray-50 py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">What Our Patients Say</h2>
				<p class="mx-auto max-w-2xl text-gray-700">
					Hear from our patients about their experiences with our AI-enhanced dental care.
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-3">
				<div class="rounded-xl bg-white p-6 shadow-md">
					<div class="mb-4 flex items-center">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-[#92afff]/60 font-bold text-white"
						>
							JS
						</div>
						<div class="ml-4">
							<h4 class="font-bold">Jennifer S.</h4>
							<div class="flex text-yellow-400">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
							</div>
						</div>
					</div>
					<p class="text-gray-700">
						"I was amazed by how the AI assistant helped me understand my treatment options. The
						virtual preview of my smile makeover was incredibly accurate, and the final results
						matched exactly what was shown!"
					</p>
				</div>

				<div class="rounded-xl bg-white p-6 shadow-md">
					<div class="mb-4 flex items-center">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-[#6247ff]/60 font-bold text-white"
						>
							MT
						</div>
						<div class="ml-4">
							<h4 class="font-bold">Michael T.</h4>
							<div class="flex text-yellow-400">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
							</div>
						</div>
					</div>
					<p class="text-gray-700">
						"As someone who always dreaded dental visits, the AI chatbot made scheduling and
						preparation so much easier. The dentists were able to understand my concerns before I
						even arrived, making my visit smooth and stress-free."
					</p>
				</div>

				<div class="rounded-xl bg-white p-6 shadow-md">
					<div class="mb-4 flex items-center">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-[#3869fe]/60 font-bold text-white"
						>
							RL
						</div>
						<div class="ml-4">
							<h4 class="font-bold">Robert L.</h4>
							<div class="flex text-yellow-400">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
							</div>
						</div>
					</div>
					<p class="text-gray-700">
						"The AI-designed crown for my molar was a perfect fit on the first try! No adjustments
						needed. It saved me time and the discomfort of multiple visits. Technology that truly
						improves the patient experience."
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Contact Section -->
	<section id="contact" class="bg-white py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Get in Touch</h2>
				<p class="mx-auto max-w-2xl text-gray-700">
					Schedule an appointment, ask questions, or learn more about our AI-powered dental
					services.
				</p>
			</div>

			<div class="grid gap-12 md:grid-cols-2">
				<div>
					<div class="rounded-xl bg-white p-6 shadow-md">
						<h3 class="mb-6 text-xl font-bold">Contact Information</h3>

						<div class="space-y-4">
							<div class="flex items-start">
								<div
									class="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#92afff]/20"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 text-[#3869fe]"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								</div>
								<div class="ml-4">
									<h4 class="font-medium text-gray-900">Address</h4>
									<p class="text-gray-700">
										1234 AI Innovation Drive<br />
										Suite 500<br />
										San Francisco, CA 94107
									</p>
								</div>
							</div>

							<div class="flex items-start">
								<div
									class="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#6247ff]/20"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 text-[#6247ff]"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
								</div>
								<div class="ml-4">
									<h4 class="font-medium text-gray-900">Phone</h4>
									<p class="text-gray-700">(555) 123-4567</p>
									<p class="mt-1 text-sm text-gray-500">Mon-Fri: 8am - 6pm</p>
								</div>
							</div>

							<div class="flex items-start">
								<div
									class="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#92afff]/20"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 text-[#3869fe]"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<div class="ml-4">
									<h4 class="font-medium text-gray-900">Email</h4>
									<p class="text-gray-700">info@dentalfloai.com</p>
								</div>
							</div>
						</div>

						<div class="mt-8">
							<h4 class="mb-4 font-medium text-gray-900">Office Hours</h4>
							<ul class="space-y-2 text-gray-700">
								<li class="flex justify-between">
									<span>Monday - Friday</span>
									<span>8:00 AM - 6:00 PM</span>
								</li>
								<li class="flex justify-between">
									<span>Saturday</span>
									<span>9:00 AM - 2:00 PM</span>
								</li>
								<li class="flex justify-between">
									<span>Sunday</span>
									<span>Closed</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div>
					<div class="rounded-xl bg-white p-6 shadow-md">
						<h3 class="mb-6 text-xl font-bold">Send Us a Message</h3>

						<form>
							<div class="mb-4 grid gap-4 md:grid-cols-2">
								<div>
									<label class="mb-2 block font-medium text-gray-700" for="name"> Your Name </label>
									<input
										type="text"
										id="name"
										class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors outline-none focus:border-[#6247ff] focus:ring-[#6247ff]"
										placeholder="John Doe"
									/>
								</div>
								<div>
									<label class="mb-2 block font-medium text-gray-700" for="email">
										Email Address
									</label>
									<input
										type="email"
										id="email"
										class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors outline-none focus:border-[#6247ff] focus:ring-[#6247ff]"
										placeholder="your@email.com"
									/>
								</div>
							</div>

							<div class="mb-4">
								<label class="mb-2 block font-medium text-gray-700" for="subject"> Subject </label>
								<input
									type="text"
									id="subject"
									class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors outline-none focus:border-[#6247ff] focus:ring-[#6247ff]"
									placeholder="How can we help you?"
								/>
							</div>

							<div class="mb-6">
								<label class="mb-2 block font-medium text-gray-700" for="message">
									Your Message
								</label>
								<textarea
									id="message"
									rows="5"
									class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors outline-none focus:border-[#6247ff] focus:ring-[#6247ff]"
									placeholder="Type your message here..."
								></textarea>
							</div>

							<button
								type="submit"
								class="w-full rounded-lg bg-[#6247ff] px-6 py-3 font-medium text-white transition-colors hover:bg-[#7534fe]"
							>
								Send Message
							</button>
						</form>

						<div class="mt-4 text-center">
							<p class="text-sm text-gray-600">
								Or chat with our AI Assistant 24/7 by clicking the chat button above.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-gray-800 pt-12 pb-8 text-white">
		<div class="container mx-auto px-4">
			<div class="grid gap-8 md:grid-cols-4">
				<div>
					<div class="mb-6 flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8 text-[#92afff]"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14H9v-2h2v2zm0-3H9V7h2v6zm2 3h-1v-2h1v2zm2 0h-1v-2h1v2zm1-3h-4V7h4v6z"
							/>
						</svg>
						<h1 class="text-xl font-bold">
							<span class="text-[#92afff]">Dentalflo</span>
							<span class="text-[#6247ff]">AI Clinic</span>
						</h1>
					</div>
					<p class="mb-6 text-gray-400">
						Pioneering AI-powered dental care for exceptional patient experiences and superior
						clinical outcomes.
					</p>
					<div class="flex space-x-4">
						<a href="#" class="text-gray-400 transition-colors hover:text-[#6247ff]">
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
						<a href="#" class="text-gray-400 transition-colors hover:text-[#6247ff]">
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
						<a href="#" class="text-gray-400 transition-colors hover:text-[#6247ff]">
							<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
								/>
							</svg>
						</a>
					</div>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-bold">Quick Links</h3>
					<ul class="space-y-2">
						<li><a href="#" class="text-gray-400 transition-colors hover:text-white">Home</a></li>
						<li>
							<a href="#about" class="text-gray-400 transition-colors hover:text-white">About Us</a>
						</li>
						<li>
							<a href="#services" class="text-gray-400 transition-colors hover:text-white"
								>Services</a
							>
						</li>
						<li>
							<a href="#technology" class="text-gray-400 transition-colors hover:text-white"
								>Our Technology</a
							>
						</li>
						<li>
							<a href="#contact" class="text-gray-400 transition-colors hover:text-white">Contact</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-bold">Our Services</h3>
					<ul class="space-y-2">
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white"
								>Preventive Care</a
							>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white"
								>Cosmetic Dentistry</a
							>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white"
								>Restorative Services</a
							>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white"
								>Pediatric Dentistry</a
							>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white"
								>Emergency Services</a
							>
						</li>
						<li>
							<a href="#" class="text-gray-400 transition-colors hover:text-white"
								>Digital Consultation</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-bold">Newsletter</h3>
					<p class="mb-4 text-gray-400">
						Subscribe to our newsletter for the latest updates on AI dental innovations and special
						offers.
					</p>
					<form class="flex">
						<input
							type="email"
							placeholder="Your email"
							class="w-full rounded-l-lg bg-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-[#6247ff] focus:outline-none"
						/>
						<button
							type="submit"
							class="rounded-r-lg bg-[#6247ff] px-4 py-2 text-white transition-colors hover:bg-[#7534fe]"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</form>
				</div>
			</div>

			<div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
				<p>© 2025 Dentalflo AI Clinic. All rights reserved.</p>
				<div class="mt-2 flex justify-center space-x-6">
					<a href="#" class="transition-colors hover:text-white">Privacy Policy</a>
					<a href="#" class="transition-colors hover:text-white">Terms of Service</a>
					<a href="#" class="transition-colors hover:text-white">Cookie Policy</a>
				</div>
			</div>
		</div>
	</footer>
</div>

<svelte:head>
	<title>Dentalflo AI Clinic - AI-Powered Dental Care</title>
	<meta
		name="description"
		content="Experience the future of dentistry with AI-enhanced diagnosis, personalized treatment plans, and cutting-edge care at Dentalflo AI Clinic."
	/>
	<meta
		name="keywords"
		content="dental clinic, AI dentistry, artificial intelligence dental care, dental technology, smart dentistry"
	/>
	<meta property="og:title" content="Dentalflo AI Clinic - AI-Powered Dental Care" />
	<meta
		property="og:description"
		content="Experience the future of dentistry with AI-enhanced diagnosis, personalized treatment plans, and cutting-edge care."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://dentalfloai.com" />
	<meta property="og:image" content="/images/dentalflo-social-preview.jpg" />
</svelte:head>
