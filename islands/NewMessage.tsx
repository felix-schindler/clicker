import { JSX } from "preact";
import { Button } from "../components/Button.tsx";

export default function NewMessage() {
	const handleSubmit: JSX.KeyboardEventHandler<HTMLTextAreaElement> = (
		event,
	) => {
		if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
			event.preventDefault();
			event.currentTarget.form?.submit();
		}
	};

	return (
		<form
			action="/messages"
			method="POST"
			class="flex flex-col gap-1 sm:items-center"
		>
			<h2 class="text-xl font-bold">New Message</h2>
			<textarea
				name="message"
				placeholder="Today I learned..."
				rows={3}
				class="w-full border(green-500 1) rounded-lg px-2 py-1"
				autoFocus
				onKeyDown={handleSubmit}
			>
			</textarea>
			<div class="flex flex-row-reverse sm:flex-row flex-wrap gap-1 items-center justify-end">
				<Button class="flex-grow sm:flex-grow-0" type="submit">Add</Button>
				<Button class="flex-grow sm:flex-grow-0" type="reset" danger={true}>Clear</Button>
			</div>
		</form>
	);
}
