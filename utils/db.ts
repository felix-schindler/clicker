const kv = await Deno.openKv();

const PREFIX = ["count"];

export default class Counter extends EventTarget {
	public static shared = new Counter();

	private constructor() {
		super();
	}

	async getCount() {
		const res = (await kv.get<number>(PREFIX)).value;
		if (res === null) await this.setCount(0);
		return res ?? 0;
	}

	async setCount(newCount: number) {
		await kv.set(PREFIX, newCount);
		this.dispatchEvent(this.getCountEvent(newCount));
	}

	private getCountEvent(count: number) {
		return new CustomEvent<{ count: number }>("count", { detail: { count } });
	}
}
