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
					<div>
						<img
							src="/logo.svg"
							class="w-32 h-32"
							alt="the fresh logo: a sliced lemon dripping with juice"
						/>
						<p class="my-6">
							Welcome to{" "}
							<code>fresh</code>. Try updating this message in the
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
