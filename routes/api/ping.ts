import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
	GET(req) {
		if (req.headers.get("upgrade") !== "websocket") {
			return new Response(null, { status: 501 });
		}

		const { socket, response } = Deno.upgradeWebSocket(req);

		socket.onmessage = (event) => {
			switch (event.data) {
				case "ping":
					socket.send("pong");
					break;
				case "pong":
					socket.send("ping");
					break;
				default:
					socket.send("Unknown event");
					break;
			}
		};

		return response;
	},
};
