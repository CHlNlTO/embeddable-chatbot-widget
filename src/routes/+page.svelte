<div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
	<div class="mx-auto w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
		<div class="bg-blue-600 p-6 text-white">
			<h1 class="text-3xl font-bold">Dental Chatbot Widget</h1>
			<p class="mt-2 opacity-90">An embeddable chatbot widget for dental practice websites</p>
		</div>

		<div class="p-6">
			<div class="prose mb-8 max-w-none">
				<p class="text-lg">
					Welcome to the chatbot widget project. This application provides an embeddable chatbot
					that can be added to any website with a simple script tag.
				</p>

				<h2>Features</h2>
				<ul>
					<li>Embeddable via script tag</li>
					<li>Minimizable/expandable interface</li>
					<li>Persistent chat history between visits</li>
					<li>Domain detection</li>
					<li>JavaScript API for controlling the widget</li>
				</ul>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<a
					href="/demo"
					class="block rounded bg-blue-600 px-6 py-4 text-center font-bold text-white transition-colors hover:bg-blue-700"
				>
					View Demo
				</a>
				<a
					href="/embed"
					class="block rounded bg-gray-200 px-6 py-4 text-center font-bold text-gray-800 transition-colors hover:bg-gray-300"
				>
					Installation Guide
				</a>
			</div>
		</div>
	</div>
</div>

<svelte:head>
	<title>Dental Chatbot Widget</title>
</svelte:head>
