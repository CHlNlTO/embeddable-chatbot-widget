<script lang="ts">
</script>

<div class="mx-auto max-w-3xl p-8">
	<h1 class="mb-6 text-3xl font-bold">Chatbot Widget Installation</h1>

	<div class="mb-8 rounded-lg bg-gray-100 p-6">
		<h2 class="mb-4 text-xl font-semibold">Add to your website</h2>
		<p class="mb-4">
			To add the chatbot widget to your website, copy and paste the following script tag into your
			HTML:
		</p>

		<pre class="mb-4 overflow-x-auto rounded bg-gray-800 p-4 text-white"><code
				>&lt;script src="http://localhost:5173/embed.js"&gt;&lt;/script&gt;</code
			></pre>

		<p class="text-sm text-gray-600">
			For production, replace <code>localhost:5173</code> with your actual domain.
		</p>
	</div>

	<div class="rounded-lg bg-gray-100 p-6">
		<h2 class="mb-4 text-xl font-semibold">JavaScript API</h2>
		<p class="mb-4">The widget also exposes a JavaScript API that allows you to control it:</p>

		<pre class="mb-2 overflow-x-auto rounded bg-gray-800 p-4 text-white"><code
				>// Open the chat widget
window.ChatbotWidget.open();

// Close (minimize) the chat widget
window.ChatbotWidget.close();

// Toggle the chat widget
window.ChatbotWidget.toggle();</code
			></pre>
	</div>
</div>
