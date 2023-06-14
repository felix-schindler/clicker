import { type StateUpdater, useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function SocketClient() {
	const [count, setCount] = useState("Loading...");

	// Open websocket connection to the server
	const ws = new WebSocket("ws://localhost:8000/api/count");

	function increment() {
		ws.send("increment");
	}

	function decrement() {
		ws.send("decrement");
	}

	function reset() {
		ws.send("reset");
	}

	ws.onopen = () => {
		ws.send("get")
	};

	ws.onmessage = (event) => {
		setCount(event.data);
	};

	return (
		<div class="flex gap-2 w-full">
			<p class="flex-grow-1 text-lg font-mono">{count}</p>
			<Button danger={true} onClick={reset}>Reset</Button>
			<Button onClick={decrement}>-1</Button>
			<Button onClick={increment}>+1</Button>
		</div>
	);
}
