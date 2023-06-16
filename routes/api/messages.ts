import { Handlers } from "$fresh/server.ts";
import { MessageModel } from "../../utils/db.ts";

const db = MessageModel.shared;

export const handler: Handlers = {
	GET(req) {
		if (req.headers.get("upgrade") !== "websocket") {
			return new Response(null, { status: 501 });
		}

		const { socket, response } = Deno.upgradeWebSocket(req);
		const channel = new BroadcastChannel("messages");

		socket.onmessage = async (event) => {
			if (typeof event.data === "string" && event.data.startsWith("delete")) {
				const id = event.data.split(":")[1];
				await db.deleteMessage(id);
			}
		};

		db.addEventListener("newMessage", (event) => {
			// @ts-ignore It's a custom event, detail does exist!
			const msg = JSON.stringify(event.detail);

			if (socket.readyState === WebSocket.OPEN) {
				socket.send(msg);
			}
			channel.postMessage(msg);
		});

		db.addEventListener("deleteMessage", (event) => {
			// @ts-ignore It's a custom event, detail does exist!
			const id = event.detail;

			if (socket.readyState === WebSocket.OPEN) {
				socket.send(`delete:${id}`);
			}
			channel.postMessage(`delete:${id}`);
		});

		channel.onmessage = (event) => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(event.data);
			}
		};

		return response;
	},
};
