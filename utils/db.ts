import Filter from "npm:bad-words";

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

	private getCountEvent(count: number) {
		return new CustomEvent<{ count: number }>("count", { detail: { count } });
	}
}

export class MessageModel extends EventTarget {
	public static shared = new MessageModel();
	private PREFIX = "messages";
	private filter = new Filter();

	private constructor() {
		super();
	}

	/**
	 * @returns All messages
	 */
	async getMessages(): Promise<string[]> {
		const messages = [];

		const msgs = kv.list<string>({ prefix: [this.PREFIX] });
		for await (const msg of msgs) {
			messages.push(msg.value);
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
		// Remove bad words
		try {
			content = this.filter.clean(content);
		} catch { /* Sometimes this crashes 🤷🏻‍♀️ (e. g. content === "$$$") */ }

		// Create unique id
		const id = Date.now() + crypto.randomUUID().split("-")[0];

		await kv.set([this.PREFIX, id], content);
		this.dispatchEvent(this.getNewMessageEvent(content));

		return id;
	}

	/**
	 * @param msg Message to dispatch
	 * @returns Event to dispatch
	 */
	private getNewMessageEvent(msg: string): CustomEvent<string> {
		return new CustomEvent<string>("newMessage", { detail: msg });
	}
}
