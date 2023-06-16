import { useEffect, useState } from "preact/hooks";

export default function SocketCounter(props: { start: number }) {
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
			<div class="flex flex-col items-center gap-2">
				<h2 class="text-xl font-bold">Counter</h2>
				<button
					type="button"
					class="
						text-3xl lg:text-6xl font-bold
						py-2 px-4 rounded-full
						bg-green-400 hover:bg-green-500 dark:bg-green-600
						h-60 w-60
						lg:h-96 lg:w-96
						transition duration-100 active:scale-105"
					onClick={increment}
				>
					<span class="font-mono">{count}</span>
					<p class="text-sm font-normal text-gray-700 dark:text-gray-200">
						Realtime across the world
					</p>
				</button>
				<button
					type="button"
					class="
					px-2 py-1
					border(red-500 2) rounded-full
					hover:bg-red-50 active:bg-red-100
					dark:bg-red-950 dark:hover:bg-red-900 dark:active:bg-red-800
					transition duration-100 active:scale-95"
					onClick={decrement}
				>
					Decrement
				</button>
			</div>
		</>
	);
}
