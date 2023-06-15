import { useEffect, useState } from "preact/hooks";
import type { Message } from "../utils/db.ts";

import IconTrash from "icons/trash.tsx";

export default function MessageList(props: { messages: Message[] }) {
	const [messages, setMessages] = useState<Message[]>(props.messages);
	const [ws, setWs] = useState<WebSocket | null>(null);

	// Initialize websocket connection on the client
	useEffect(() => {
		const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
		const host = window.location.host;

		const newWs = new WebSocket(`${wsProtocol}://${host}/api/messages`);

		newWs.onmessage = (event) => {
			const body: unknown = event.data;

			if (typeof body === "string" && body.startsWith("delete:")) {
				// Delete message
				const id = body.split(":")[1];
				setMessages(messages.filter((msg) => msg.id !== id));
			} else {
				// Add new message
				const newMsg = body as Message;
				setMessages([newMsg, ...messages]);
			}
		};

		setWs(newWs);

		// Return disconnect function
		return () => {
			newWs.close();
		};
	}, []);

	function deleteMsg(id: string) {
		if (ws?.readyState === WebSocket.OPEN) {
			ws.send(`delete:${id}`);
		} else {
			console.error("Websocket is not open");
		}
	}

	return (
		<>
			<h2 class="text-xl font-bold">Messages</h2>
			<ul class="divide-y">
				{messages.map((msg) => {
					return (
						<li class="flex flex-wrap py-1">
							<span class="flex-grow">{msg.content}</span>
							<button
								class="text-red-500"
								type="button"
								onClick={() => deleteMsg(msg.id)}
							>
								<IconTrash class="w-6 h-6" />
							</button>
						</li>
					);
				})}
			</ul>
		</>
	);
}
