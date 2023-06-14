import { type StateUpdater, useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function SocketClient() {
	const [answer, setAnswer] = useState("/");

	// Open websocket connection to the server
	const ws = new WebSocket("ws://localhost:8000/api/ping");

	function sendPing() {
		ws.send("ping");
	}

	ws.onopen = () => {
		console.log("Connected to server");
	};

	ws.onmessage = (event) => {
		console.log("Message from server ", event.data);
		setAnswer(event.data);
	};

	return (
		<div class="flex gap-2 w-full">
			<p class="flex-grow-1 text-lg font-mono">{answer}</p>
			<Button onClick={sendPing}>Ping!</Button>
		</div>
	);
}
