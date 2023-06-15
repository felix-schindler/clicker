import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(
	props: JSX.HTMLAttributes<HTMLButtonElement> & {
		serverAllowed?: boolean;
		danger?: boolean;
	},
) {
	return (
		<button
			{...props}
			disabled={(!props.serverAllowed && !IS_BROWSER) || props.disabled}
			class={`
				px-2 py-1 rounded-md
				border(${props.danger ? "red" : "green"}-500 2)
				hover:bg-${props.danger ? "red" : "green"}-300
				active:bg-${props.danger ? "red" : "green"}-400
				dark:hover:bg-${props.danger ? "red" : "green"}-700
				dark:active:bg-${props.danger ? "red" : "green"}-600
			`}
		/>
	);
}
