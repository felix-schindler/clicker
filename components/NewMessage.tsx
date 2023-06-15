import { Button } from "../components/Button.tsx";

export default function NewMessage() {
	return (
		<form
			action="/messages"
			method="POST"
			class="flex flex-col gap-1 items-center"
		>
			<h2 class="text-xl font-bold">New Message</h2>
			<textarea
				name="message"
				placeholder="Today I learned..."
				rows={3}
				class="w-1/2 border(green-500 1) rounded-md px-2 py-1"
			>
			</textarea>
			<div class="flex gap-1 flex-wrap">
				<Button type="submit" serverAllowed={true}>Send</Button>
				<Button type="reset" danger={true} serverAllowed={true}>Clear</Button>
			</div>
		</form>
	);
}
