import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function SocketClient(props: { start: number }) {
	const [count, setCount] = useState(props.start);

	let ws: WebSocket;

	// Initialize websocket connection on the client
	if (IS_BROWSER) {
		// Get the protocol and host of current server
		const { protocol, host } = window.location;

		// Use wss if the page is loaded over https
		const wsProtocol = protocol.includes("s") ? "wss" : "ws";

		// Open websocket connection to the server
		ws = new WebSocket(`${wsProtocol}://${host}/api/count`);

		ws.onopen = () => {
			// Get current count
			ws.send("get");
		};

		ws.onmessage = (event) => {
			// Update count
			setCount(event.data);
		};
	}

	function increment() {
		ws.send("increment");
	}

	function decrement() {
		ws.send("decrement");
	}

	function reset() {
		ws.send("reset");
	}

	return (
		<div class="flex items-center gap-2 w-full">
			<p class="flex-grow-1 text-lg font-mono">{count}</p>
			<Button danger={true} onClick={reset}>Reset</Button>
			<Button onClick={decrement}>-1</Button>
			<Button onClick={increment}>+1</Button>
		</div>
	);
}
