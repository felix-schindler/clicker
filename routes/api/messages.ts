import { Handlers } from "$fresh/server.ts";
import { MessageModel } from "../../utils/db.ts";

const db = MessageModel.shared;
const sockets: Set<WebSocket> = new Set();
const channel = new BroadcastChannel("messages");

// Event listener for newMessage event from the database
db.addEventListener("newMessage", (event) => {
	// @ts-ignore It's a custom event, detail does exist!
	const msg = JSON.stringify(event.detail);

	for (const socket of sockets) {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(msg);
		}
	}
	channel.postMessage(msg);
});

// Event listener for deleteMessage event from the database
db.addEventListener("deleteMessage", (event) => {
	// @ts-ignore It's a custom event, detail does exist!
	const id = event.detail;

	for (const socket of sockets) {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(`delete:${id}`);
		}
	}
	channel.postMessage(`delete:${id}`);
});

export const handler: Handlers = {
	GET(req) {
		if (req.headers.get("upgrade") !== "websocket") {
			return new Response(null, { status: 501 });
		}

		const { socket, response } = Deno.upgradeWebSocket(req);
		sockets.add(socket);

		channel.onmessage = (event) => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(event.data.toString());
			}
		};

		socket.onmessage = async (event) => {
			if (typeof event.data === "string" && event.data.startsWith("delete")) {
				const id = event.data.split(":")[1];
				await db.deleteMessage(id);
			}
		};

		socket.onclose = () => {
			sockets.delete(socket);
		};

		return response;
	},
};
