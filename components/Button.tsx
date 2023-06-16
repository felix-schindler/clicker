import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(
	props: JSX.HTMLAttributes<HTMLButtonElement> & {
		danger?: boolean;
	},
) {
	return (
		<button
			{...props}
			disabled={!IS_BROWSER || props.disabled}
			class={props.class + `
				px-2 py-1 rounded-md
				border(${props.danger ? "red" : "green"}-500 2)
				hover:bg-${props.danger ? "red" : "green"}-200
				active:bg-${props.danger ? "red" : "green"}-300
				dark:hover:bg-${props.danger ? "red" : "green"}-700
				dark:active:bg-${props.danger ? "red" : "green"}-600
			`}
		/>
	);
}
