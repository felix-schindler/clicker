import { Handlers } from "$fresh/server.ts";
import Counter from "../../utils/db.ts";

const db = Counter.shared;

export const handler: Handlers = {
	GET(req) {
		if (req.headers.get("upgrade") !== "websocket") {
			return new Response(null, { status: 501 });
		}

		const { socket, response } = Deno.upgradeWebSocket(req);

		socket.onopen = (_event) => {
			Counter.shared.addEventListener("count", (event) => {
				console.log("Count Event", event);
				// @ts-ignore - Detail exists
				socket.send(event.detail.count.toString());
			});
		};

		socket.onmessage = async (event) => {
			let newCount = await db.getCount();

			switch (event.data) {
				case "get": {
					socket.send(db.toString());
					break;
				}
				case "increment": {
					await db.setCount(++newCount);
					socket.send(newCount.toString());
					break;
				}
				case "decrement": {
					await db.setCount(--newCount);
					socket.send(newCount.toString());
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
		let newCount = await db.getCount();

		if (increment) {
			await db.setCount(++newCount);
		} else {
			await db.setCount(--newCount);
		}

		return new Response(newCount.toString());
	},
};
