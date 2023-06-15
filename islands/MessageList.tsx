import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";

export default function SocketClient(props: { messages: string[] }) {
	const [messages, setMessages] = useState(props.messages);

	let ws: WebSocket;

	// Initialize websocket connection on the client
	if (IS_BROWSER) {
		// Get the protocol and host of current server
		const { protocol, host } = window.location;

		// Use wss if the page is loaded over https
		const wsProtocol = protocol.includes("s") ? "wss" : "ws";

		// Open websocket connection to the server
		ws = new WebSocket(`${wsProtocol}://${host}/api/messages`);

		ws.onmessage = (event) => {
			// Update messages
			setMessages([event.data, ...messages]);
			console.log("New message", event.data);
		};
	}

	return (
		<>
			<h2 class="text-xl font-bold">Messages</h2>
			<ul class="divide-y">
				{messages.map((msg) => {
					return <li class="py-1">{msg}</li>;
				})}
			</ul>
		</>
	);
}
