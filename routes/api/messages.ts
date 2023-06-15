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

		db.addEventListener("newMessage", (event) => {
			// @ts-ignore It's a custom event, detail does exist!
			const msg = event.detail;

			if (socket.readyState === WebSocket.OPEN) {
				socket.send(msg);
			}
			channel.postMessage(msg);
		});

		return response;
	},
};
