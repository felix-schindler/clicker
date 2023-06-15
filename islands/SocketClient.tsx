import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function SocketClient() {
	const [answer, setAnswer] = useState("/");

	let ws: WebSocket;

	// Initialize websocket connection on the client
	if (IS_BROWSER) {
		// Get the protocol and host of current server
		const { protocol, host } = window.location;

		// Use wss if the page is loaded over https
		const wsProtocol = protocol.includes("s") ? "wss" : "ws";

		// Open websocket connection to the server
		ws = new WebSocket(`${wsProtocol}://${host}/api/ping`);

		ws.onmessage = (event) => {
			setAnswer(event.data);
		};
	}

	function sendPing() {
		ws.send("ping");
	}

	return (
		<div class="flex items-center gap-2 w-full">
			<p class="flex-grow-1 text-lg font-mono">{answer}</p>
			<Button onClick={sendPing}>Ping!</Button>
		</div>
	);
}
