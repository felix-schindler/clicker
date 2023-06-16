import type { Handlers, PageProps } from "$fresh/server.ts";
import { type Message, MessageModel } from "../utils/db.ts";

import MessageList from "../islands/MessageList.tsx";
import NewMessage from "../islands/NewMessage.tsx";

interface MessagePageProps {
	messages: Message[];
	error?: {
		code: number;
		msg: string;
	};
}

export const handler: Handlers<MessagePageProps> = {
	async GET(_req, ctx) {
		return ctx.render({
			messages: await MessageModel.shared.getMessages(),
		});
	},
	async POST(req, ctx) {
		const body = await req.formData();
		const msg = body.get("message");

		// Empty message -> return status code 400
		if (!msg || typeof msg !== "string" || msg.length === 0) {
			const code = 400;
			const msg = "Message cannot be empty and has to be a string";

			return ctx.render({
				messages: await MessageModel.shared.getMessages(),
				error: {
					code,
					msg,
				},
			}, { status: 400, statusText: msg });
		}

		// Add message to the database
		await MessageModel.shared.addMessage(msg);

		return ctx.render({ messages: await MessageModel.shared.getMessages() });
	},
};

export default function MessagePage(props: PageProps<MessagePageProps>) {
	return (
		<>
			<div class="w-full sm:w-3/4 md:w-1/2 mx-auto mb-2">
				{props.data.error && (
					<div class="
						w-full mx-auto p-2 mb-5 rounded-md
						flex-col items-center justify-center gap-1
						border(red-400 2)
						bg-red-100 text-red-500
						dark:border-red-400
						dark:bg-red-900 dark:text-red-300
					">
						<h2 class="font-mono font-semibold">
							Error {props.data.error.code}
						</h2>
						<p class="text-sm">{props.data.error.msg}</p>
					</div>
				)}
				<NewMessage />
			</div>
			<div>
				<MessageList messages={props.data.messages} />
			</div>
		</>
	);
}
