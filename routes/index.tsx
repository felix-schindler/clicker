import type { Handlers, PageProps } from "$fresh/server.ts";
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
	return <SocketCounter start={props.data.start} />;
}
