import { JSX } from "preact";

export default function NavLink(
	props: JSX.HTMLAttributes<HTMLAnchorElement> & {
		href: string;
		content: string;
		active?: boolean;
	},
) {
	return (
		<a
			{...props}
			href={props.href}
			class={`
			px-2 py-1 rounded-xl
			${
				props.active
					? "bg-green-200 dark:bg-green-700"
					: "hover:bg-green-300 dark:hover:bg-green-600"
			}
		`}
		>
			{props.content}
		</a>
	);
}
