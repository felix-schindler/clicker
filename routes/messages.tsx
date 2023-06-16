import type { Handlers, PageProps } from "$fresh/server.ts";
import { type Message, MessageModel } from "../utils/db.ts";

import MessageList from "../islands/MessageList.tsx";
import NewMessage from "../components/NewMessage.tsx";

interface MessagePageProps {
	messages: Message[];
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
			<div>
				<NewMessage />
			</div>
			<div>
				<MessageList messages={props.data.messages} />
			</div>
		</>
	);
}
