import { Handlers } from "$fresh/server.ts";
import { CounterModel } from "../../utils/db.ts";

const db = CounterModel.shared;
const sockets: Set<WebSocket> = new Set();
const channel = new BroadcastChannel("count");

// Listen to own count changes
db.addEventListener("count", (event) => {
	// @ts-ignore It's a custom event, detail does exist!
	const count = event.detail.count;

	// Send count to clients
	for (const socket of sockets) {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(count.toString());
		}
	}

	// Send count to other servers
	channel.postMessage(count);
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
				default:
					socket.send("Unknown event");
					break;
			}
		};

		socket.onclose = () => {
			sockets.delete(socket);
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

		return new Response();
	},
};
