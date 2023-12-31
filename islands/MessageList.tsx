import { useEffect, useState } from "preact/hooks";
import type { Message } from "../utils/db.ts";

import IconTrash from "icons/trash.tsx";
import IconMessageOff from "icons/message-off.tsx";

export default function MessageList(props: { messages: Message[] }) {
	const [messages, setMessages] = useState<Message[]>(props.messages);
	const [ws, setWs] = useState<WebSocket | null>(null);

	// Initialize websocket connection on the client
	useEffect(() => {
		const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
		const host = window.location.host;

		const newWs = new WebSocket(`${wsProtocol}://${host}/api/messages`);

		newWs.onmessage = (event) => {
			const body: string = event.data;

			setMessages((prevMessages) => {
				if (body.startsWith("delete:")) {
					// Delete message
					const id = body.split(":")[1];
					return prevMessages.filter((msg) => msg.id !== id);
				} else {
					// Add new message to bottom of list
					const newMsg = JSON.parse(body) as Message;
					return [...prevMessages, newMsg];
				}
			});
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
			<div class="flex flex-wrap gap-2 items-baseline">
				<h2 class="text-xl font-bold">Messages</h2>
				<p class="text-sm text-gray-700 dark:text-gray-300">
					Realtime across the world
				</p>
			</div>
			{messages.length === 0
				? (
					<p class="flex gap-1">
						<IconMessageOff /> No messages, create one above
					</p>
				)
				: (
					<ul class="divide-y">
						{messages.map((msg) => {
							return (
								<li class="flex items-start justify-between py-1">
									<span>{msg.content}</span>
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
				)}
		</>
	);
}
