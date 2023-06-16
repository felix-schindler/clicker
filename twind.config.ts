import { Options } from "$fresh/plugins/twind.ts";

export default {
	selfURL: import.meta.url,
	theme: {
		extend: {
			gridTemplateRows: {
				"hmf": "auto 1fr auto", // my standard header - main - footer layout
			},
			colors: {
				green: {
					950: "#052e16", // in tailwind but not twind(?)
				},
				red: {
					950: "#450a0a", // in tailwind but not twind(?)
				},
			},
		},
	},
} as Options;
