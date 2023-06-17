import { useEffect, useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function SocketPing() {
	const [answer, setAnswer] = useState("----");
	const [ws, setWs] = useState<WebSocket | null>(null);

	// Initialize websocket connection on the client
	useEffect(() => {
		// Get the protocol and host of current server
		const { protocol, host } = window.location;

		// Use wss if the page is loaded over https
		const wsProtocol = protocol.includes("s") ? "wss" : "ws";

		// Open websocket connection to the server
		const newWs = new WebSocket(`${wsProtocol}://${host}/api/ping`);

		newWs.onmessage = (event) => {
			setAnswer(event.data);
		};

		setWs(newWs);

		// Return disconnect function
		return () => {
			newWs.close();
		};
	}, []);

	function reset() {
		setAnswer("----");
	}

	function sendPing() {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send("ping");
		} else {
			console.error("Socket connection is not open");
		}
	}

	return (
		<div class="flex flex-wrap gap-2 items-center font-mono">
			{answer === "----"
				? <Button onClick={sendPing}>Ping!</Button>
				: <Button onClick={reset} danger={true}>Reset</Button>}
			<p>{answer}</p>
		</div>
	);
}
