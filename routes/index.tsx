import type { Handlers, PageProps } from "$fresh/server.ts";
import { CounterModel } from "../utils/db.ts";

import SocketPing from "../islands/SocketPing.tsx";
import SocketCounter from "../islands/SocketCounter.tsx";

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
			<div>
				<SocketCounter start={props.data.start} />
			</div>
			<details>
				<summary class="cursor-pointer">
					Ping socket server
					<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
						If the Socker Counter doesn't update, try to ping the server
					</span>
				</summary>
				<div class="mt-1">
					<SocketPing />
				</div>
			</details>
		</>
	);
}
