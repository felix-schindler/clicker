import type { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { CounterModel } from "../utils/db.ts";

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
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, user-scalable=no"
				/>
			</Head>
			<SocketCounter start={props.data.start} />
		</>
	);
}
