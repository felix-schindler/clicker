const kv = await Deno.openKv();

export class CounterModel extends EventTarget {
	public static shared = new CounterModel();
	private PREFIX = "count";

	private constructor() {
		super();
	}

	/**
	 * @returns Current count
	 */
	async getCount() {
		const res = (await kv.get<number>([this.PREFIX])).value;
		if (res === null) await this.setCount(0);
		return res ?? 0;
	}

	/**
	 * Sets a new count and dispatches a count event
	 * @param newCount New count
	 */
	async setCount(newCount: number): Promise<void> {
		await kv.set([this.PREFIX], newCount);
		this.dispatchEvent(this.getCountEvent(newCount));
	}

	/**
	 * @param count Count to dispatch
	 * @returns Count event
	 */
	private getCountEvent(count: number) {
		return new CustomEvent<{ count: number }>("count", { detail: { count } });
	}
}

export type Message = {
	id: string;
	content: string;
};

export class MessageModel extends EventTarget {
	public static shared = new MessageModel();
	private PREFIX = "messages";

	private constructor() {
		super();
	}

	/**
	 * @returns All messages
	 */
	async getMessages(): Promise<Message[]> {
		const messages = [];

		const msgs = kv.list<string>({ prefix: [this.PREFIX] });
		for await (const msg of msgs) {
			messages.push({ id: (msg.key[1] as string), content: msg.value });
		}

		return messages;
	}

	/**
	 * Gets a message by id
	 * @param id ID of the message
	 * @returns Content of the message or null if message does not exist
	 */
	async getMessage(id: string): Promise<string | null> {
		return (await kv.get<string>([this.PREFIX, id])).value;
	}

	/**
	 * Creates a new message
	 * Dispatches a "newMessage" event
	 * @param content Content of the message
	 * @returns ID of the new message
	 */
	async addMessage(content: string): Promise<string> {
		// Create "unique" id
		const id = Date.now() + crypto.randomUUID().split("-")[0];

		await kv.set([this.PREFIX, id], content);
		this.dispatchEvent(
			new CustomEvent<Message>("newMessage", { detail: { id, content } }),
		);

		return id;
	}

	/**
	 * Deletes a message
	 * @param id ID of the message to delete
	 */
	async deleteMessage(id: string): Promise<void> {
		await kv.delete([this.PREFIX, id]);
		this.dispatchEvent(
			new CustomEvent<string>("deleteMessage", { detail: id }),
		);
	}
}
