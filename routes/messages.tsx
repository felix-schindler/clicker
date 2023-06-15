import type { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { MessageModel } from "../utils/db.ts";

import MessageList from "../islands/MessageList.tsx";
import NewMessage from "../components/NewMessage.tsx";
import NavLink from "../components/NavLink.tsx";

interface MessagePageProps {
	messages: string[];
}

export const handler: Handlers<MessagePageProps> = {
	async GET(_req, ctx) {
		return ctx.render({ messages: await MessageModel.shared.getMessages() });
	},
	async POST(req, ctx) {
		const body = await req.formData();
		const msg = body.get("message");

		// Empty message -> return status code 400
		if (!msg || typeof msg !== "string" || msg.length === 0) {
			return new Response("Message cannot be empty and has to be a string", {
				status: 400,
			});
		}

		// Add message to the database
		await MessageModel.shared.addMessage(msg);

		return ctx.render({ messages: await MessageModel.shared.getMessages() });
	},
};

export default function MessagePage(props: PageProps<MessagePageProps>) {
	return (
		<>
			<Head>
				<title>Counter</title>
				{/* "PWA" */}
				<meta name="color-scheme" content="dark light" />
				<meta
					name="theme-color"
					media="(prefers-color-scheme: light)"
					content="#f0fdf4"
				/>
				<meta
					name="theme-color"
					media="(prefers-color-scheme: dark)"
					content="#052e16"
				/>
				{/* SEO */}
				<meta name="author" content="Felix Schindler" />
				<meta
					name="description"
					content="A simple counter. Realtime around the world"
				/>
			</Head>
			<body class="min-h-screen max-w-screen-md mx-auto
				grid grid-rows-hmf
				bg-green-50 dark:bg-green-950
			">
				<header class="p-4 text-center">
					<img
						src="/logo.svg"
						class="w-32 h-32 mx-auto mb-3"
						alt="the deno logo: a dino in the rain"
					/>
					<p class="text-lg">
						Welcome to my <span class="font-serif">Counter</span>
					</p>
					<p class="text-gray-700 dark:text-gray-300">
						using Deno Deploy, Fresh, Deno KV, BroadcastChannel and WebSockets
					</p>
					<div class="flex gap-2 justify-center mt-2">
						<NavLink href="/" content="Start" />
						<NavLink href="/messages" content="Message board" active={true} />
					</div>
				</header>
				<div class="p-4 flex flex-col gap-4">
					<div>
						<NewMessage />
					</div>
					<div>
						<MessageList messages={props.data.messages} />
					</div>
				</div>
				<footer class="p-4">
					<p>
						Made by{" "}
						<a class="hover:text-underline" href="https://schindlerfelix.de">
							Felix
						</a>
					</p>
					<a href="https://fresh.deno.dev">
						<img src="/fresh-badge.svg" alt="Made with Fresh" />
					</a>
				</footer>
			</body>
		</>
	);
}
