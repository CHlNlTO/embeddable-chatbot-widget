<script lang="ts">
	// This page provides installation instructions for the chatbot widget
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
				>&lt;script src="https://your-cdn-domain.com/embed.js"&gt;&lt;/script&gt;</code
			></pre>

		<p class="text-sm text-gray-600">
			For production, replace <code>your-cdn-domain.com</code> with your actual CDN domain.
		</p>
	</div>

	<div class="mb-8 rounded-lg bg-gray-100 p-6">
		<h2 class="mb-4 text-xl font-semibold">Placement</h2>
		<p class="mb-4">
			The script tag can be placed in either the <code>&lt;head&gt;</code> or at the end of the
			<code>&lt;body&gt;</code>
			section of your HTML. The widget will automatically initialize when the page loads.
		</p>

		<p class="mb-4">
			For better performance, we recommend adding it just before the closing <code
				>&lt;/body&gt;</code
			> tag.
		</p>

		<pre class="mb-4 overflow-x-auto rounded bg-gray-800 p-4 text-white"><code
				>&lt;!-- At the end of your body tag --&gt;
&lt;script src="https://your-cdn-domain.com/embed.js"&gt;&lt;/script&gt;
&lt;/body&gt;</code
			></pre>
	</div>

	<div class="rounded-lg bg-gray-100 p-6">
		<h2 class="mb-4 text-xl font-semibold">JavaScript API</h2>
		<p class="mb-4">The widget exposes a JavaScript API that allows you to control it:</p>

		<pre class="mb-2 overflow-x-auto rounded bg-gray-800 p-4 text-white"><code
				>// Open the chat widget
window.ChatbotWidget.open();

// Close (minimize) the chat widget
window.ChatbotWidget.close();

// Toggle the chat widget
window.ChatbotWidget.toggle();

// Check if the widget is open
const isOpen = window.ChatbotWidget.isOpen();</code
			></pre>

		<p class="mt-4 mb-4">Example: Add a button to open the chat</p>

		<pre class="overflow-x-auto rounded bg-gray-800 p-4 text-white"><code
				>&lt;button onclick="window.ChatbotWidget.open()"&gt;Chat with us&lt;/button&gt;</code
			></pre>
	</div>
</div>

<svelte:head>
	<title>Chatbot Widget Installation</title>
</svelte:head>
