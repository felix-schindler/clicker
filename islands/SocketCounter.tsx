import { useEffect, useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function SocketClient(props: { start: number }) {
	const [count, setCount] = useState(props.start);
	const [ws, setWs] = useState<WebSocket | null>(null);

	// Initialize websocket connection on the client
	useEffect(() => {
		// Get the protocol and host of current server
		const { protocol, host } = window.location;

		// Use wss if the page is loaded over https
		const wsProtocol = protocol.includes("s") ? "wss" : "ws";

		// Open websocket connection to the server
		const newWs = new WebSocket(`${wsProtocol}://${host}/api/count`);

		newWs.onopen = () => {
			// Get current count
			newWs.send("get");
		};

		newWs.onmessage = (event) => {
			// Update count
			setCount(event.data);
		};

		setWs(newWs);

		// Return disconnect function
		return () => {
			newWs.close();
		};
	}, []);

	function increment() {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send("increment");
		} else {
			console.error("Socket connection is not open");
		}
	}

	function decrement() {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send("decrement");
		} else {
			console.error("Socket connection is not open");
		}
	}

	return (
		<>
			<div class="flex flex-wrap gap-2 items-baseline">
				<h2 class="text-xl font-bold">Counter</h2>
				<p class="text-sm text-gray-700 dark:text-gray-300">
					Realtime across the world
				</p>
			</div>
			<div class="flex items-center gap-2 w-full">
				<p class="flex-grow-1 text-lg font-mono">{count}</p>
				<Button onClick={decrement} danger={true}>-1</Button>
				<Button onClick={increment}>+1</Button>
			</div>
		</>
	);
}
