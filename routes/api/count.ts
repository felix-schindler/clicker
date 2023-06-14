import { Handlers } from "$fresh/server.ts";
import { getCount, setCount } from "../../utils/db.ts";

export const handler: Handlers = {
	GET(req) {
		if (req.headers.get("upgrade") !== "websocket") {
			return new Response(null, { status: 501 });
		}

		const { socket, response } = Deno.upgradeWebSocket(req);

		socket.onopen = (_event) => {
			console.log("Client connected");
		};

		socket.onmessage = async (event) => {
			let newCount = await getCount() ?? 0;

			switch (event.data) {
				case "get": {
					socket.send(newCount.toString());
					break;
				}
				case "increment": {
					await setCount(++newCount);
					socket.send(newCount.toString());
					break;
				}
				case "decrement": {
					await setCount(--newCount);
					socket.send(newCount.toString());
					break;
				}
				case "reset": {
					await setCount(0);
					socket.send("0");
					break;
				}
				default:
					socket.send("Unknown event");
					break;
			}
		}

		return response;
	},
	async POST(req) {
		const increment = Boolean(new URL(req.url).searchParams.get("increment"));
		let newCount = await getCount() ?? 0;

		if (increment) {
			await setCount(++newCount);
		} else {
			await setCount(--newCount);
		}

		return new Response(newCount.toString());
	},
};
