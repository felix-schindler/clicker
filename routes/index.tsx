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
				<title>Fresh App with Deno KV</title>
				<meta name="color-scheme" content="dark light" />
			</Head>
			<body class="bg-green-200 dark:bg-green-900">
				<div class="p-4 mx-auto max-w-screen-md flex flex-col gap-2">
					<div class="flex flex-col items-center">
						<img
							src="https://dash.deno.com/assets/logo.svg"
							class="w-32 h-32 mb-3"
							alt="the deno logo: a dino in the rain"
						/>
						<p>Welcome to my <span class="font-serif">Counter</span></p>
						<p class="text-gray-700 dark:text-gray-300">
							Try updating this message in the
							./routes/index.tsx file, and refresh.
						</p>
					</div>
					<div>
						<h2 class="text-xl font-bold">Counter</h2>
						<Counter start={props.data.start} />
					</div>
					<div>
						<h2 class="text-xl font-bold">Socket</h2>
						<SocketClient />
					</div>
					<div>
						<h2 class="text-xl font-bold">Socket Counter</h2>
						<SocketCounter />
					</div>
				</div>
			</body>
		</>
	);
}
