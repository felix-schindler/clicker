import type { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { CounterModel } from "../utils/db.ts";

import SocketPing from "../islands/SocketPing.tsx";
import SocketCounter from "../islands/SocketCounter.tsx";
import NavLink from "../components/NavLink.tsx";

interface HomeProps {
	start: number;
}

export const handler: Handlers<HomeProps> = {
	async GET(_req, ctx) {
		return ctx.render({ start: await CounterModel.shared.getCount() });
	},
};

export default function Home(props: PageProps<HomeProps>) {
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
					<nav class="flex gap-2 justify-center mt-2">
						<NavLink href="/" content="Start" active={true} />
						<NavLink href="/messages" content="Message board" />
					</nav>
				</header>
				<div class="p-4 flex flex-col gap-4">
					<div>
						<div class="flex flex-wrap gap-2 items-baseline">
							<h2 class="text-xl font-bold">Counter</h2>
							<p class="text-sm text-gray-700 dark:text-gray-300">
								Realtime across the world
							</p>
						</div>
						<SocketCounter start={props.data.start} />
					</div>
					<details>
						<summary class="cursor-pointer">Ping socket server</summary>
						<div class="mt-1">
							<SocketPing />
							<p class="text-sm text-gray-700 dark:text-gray-300">
								If the Socker Counter doesn't update, try to ping the server
							</p>
						</div>
					</details>
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
