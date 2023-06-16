import { Handlers } from "$fresh/server.ts";
import { MessageModel } from "../../utils/db.ts";

const db = MessageModel.shared;
const sockets: Set<WebSocket> = new Set();

export const handler: Handlers = {
	GET(req) {
		// Check if the request is for WebSocket upgrade
		if (req.headers.get("upgrade") !== "websocket") {
			return new Response(null, { status: 501 });
		}

		// Upgrade the request to WebSocket
		const { socket, response } = Deno.upgradeWebSocket(req);
		sockets.add(socket);

		// Create a BroadcastChannel to communicate with all clients
		const channel = new BroadcastChannel("messages");

		// Broadcast received messages to the client WebSocket connection
		channel.onmessage = (event) => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(event.data);
			}
		};

		// Handle incoming WebSocket messages
		socket.onmessage = async (event) => {
			if (typeof event.data === "string" && event.data.startsWith("delete")) {
				// Extract the message ID from the delete command
				const id = event.data.split(":")[1];
				await db.deleteMessage(id);
			}
		};

		// Remove the WebSocket connection from the set on close
		socket.onclose = () => {
			sockets.delete(socket);
		};

		return response;
	},
};

// Event listener for newMessage event from the database
db.addEventListener("newMessage", (event) => {
	// @ts-ignore It's a custom event, detail does exist!
	const msg = JSON.stringify(event.detail);

	// Send the new message to all connected clients
	for (const socket of sockets) {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(msg);
		}
	}
});

// Event listener for deleteMessage event from the database
db.addEventListener("deleteMessage", (event) => {
	// @ts-ignore It's a custom event, detail does exist!
	const id = event.detail;

	// Send the delete command to all connected clients
	for (const socket of sockets) {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(`delete:${id}`);
		}
	}
});
