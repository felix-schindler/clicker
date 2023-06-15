import type { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";
import SocketClient from "../islands/SocketClient.tsx";
import SocketCounter from "../islands/SocketCounter.tsx";
import CounterModel from "../utils/db.ts";

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
				<meta name="color-scheme" content="dark light" />
			</Head>
			<body class="min-h-screen max-w-screen-md mx-auto
				grid grid-rows-hmf
				bg-green-200 dark:bg-green-900
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
				</header>
				<div class="p-4 flex flex-col gap-4">
					<div>
						<h2 class="text-xl font-bold">Socket Counter</h2>
						<SocketCounter start={props.data.start} />
					</div>
					<details>
						<summary class="cursor-pointer">Ping socket server</summary>
						<div class="mt-1">
							<h2 class="text-xl font-bold">Socket</h2>
							<SocketClient />
							<p class="text-sm text-gray-700 dark:text-gray-300">
								If the Socker Counter doesn't update, try to ping the server
							</p>
						</div>
					</details>
					<details>
						<summary class="cursor-pointer">Non-realtime counter</summary>
						<div class="mt-1">
							<h2 class="text-xl font-bold">Counter</h2>
							<Counter start={props.data.start} />
							<p class="text-sm text-gray-700 dark:text-gray-300">
								Go slow on this one, clicking too fast might crash the website
								on your browser
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
