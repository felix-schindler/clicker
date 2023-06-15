import { Handlers } from "$fresh/server.ts";
import { CounterModel } from "../../utils/db.ts";

const db = CounterModel.shared;

export const handler: Handlers = {
	GET(req) {
		if (req.headers.get("upgrade") !== "websocket") {
			return new Response(null, { status: 501 });
		}

		const { socket, response } = Deno.upgradeWebSocket(req);
		const channel = new BroadcastChannel("count");

		// Listen to own count changes
		db.addEventListener("count", (event) => {
			// @ts-ignore It's a custom event, detail does exist!
			const count = event.detail.count;

			// Send count to clients
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(count.toString());
			}

			// Send count to other servers
			channel.postMessage(count);
		});

		// Listen count changes on other servers
		channel.onmessage = (event) => {
			// Send count to clients
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(event.data.toString());
			}
		};

		// Listen to client messages
		socket.onmessage = async (event) => {
			let count = await db.getCount();

			switch (event.data) {
				case "get": {
					socket.send(count.toString());
					break;
				}
				case "increment": {
					await db.setCount(++count);
					socket.send(count.toString());
					break;
				}
				case "decrement": {
					await db.setCount(--count);
					socket.send(count.toString());
					break;
				}
				case "reset": {
					await db.setCount(0);
					socket.send("0");
					break;
				}
				default:
					socket.send("Unknown event");
					break;
			}
		};

		return response;
	},
	async POST(req) {
		const increment = Boolean(new URL(req.url).searchParams.get("increment"));
		let count = await db.getCount();

		if (increment) {
			await db.setCount(++count);
		} else {
			await db.setCount(--count);
		}

		// Response - 200 OK
		return new Response();
	},
};
