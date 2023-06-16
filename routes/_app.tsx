import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import NavLink from "../components/NavLink.tsx";

export default function App(props: AppProps) {
	return (
		<>
			<Head>
				<title>Counter</title>
				{/* "PWA" */}
				<meta name="color-scheme" content="dark light" />
				<meta
					name="theme-color"
					media="(prefers-color-scheme: light)"
					content="#f0fdf4"
				/>
				<meta
					name="theme-color"
					media="(prefers-color-scheme: dark)"
					content="#052e16"
				/>
				{/* SEO */}
				<meta name="author" content="Felix Schindler" />
				<meta
					name="description"
					content="A simple counter. Realtime around the world"
				/>
			</Head>
			<body class="min-h-screen max-w-screen-md mx-auto
				grid grid-rows-hmf
				bg-green-50 dark:bg-green-950
			">
				<header class="p-4 text-center">
					<img
						src="/logo.svg"
						class="w-32 h-32 mx-auto mb-3"
						alt="the deno logo: a dino in the rain"
					/>
					<p class="text-lg">
						Welcome to my <span class="font-serif">Counter</span>
					</p>
					<p class="text-gray-700 dark:text-gray-300">
						using Deno Deploy, Fresh, Deno KV, BroadcastChannel and WebSockets
					</p>
					<nav class="flex gap-2 justify-center mt-2">
						<NavLink href="/" content="Start" active={props.route == "/"} />
						<NavLink
							href="/messages"
							content="Message board"
							active={props.route == "/messages"}
						/>
					</nav>
				</header>
				<main class="p-4 flex flex-col gap-4">
					{<props.Component />}
				</main>
				<footer class="p-4">
					<a class="mx-auto" href="https://fresh.deno.dev">
						<img class="mx-auto" src="/fresh-badge.svg" alt="Made with Fresh" />
					</a>
					<div class="flex flex-wrap mt-2 gap-8 justify-center text-sm">
						<div>
							<h3 class="font-semibold">Made by</h3>
							<a
								class="hover:text-underline"
								href="https://schindlerfelix.de"
							>
								Felix
							</a>
						</div>
						<div>
							<h3 class="mt-1 font-semibold">Keyboard Shortcuts</h3>
							<span>Submit form</span>{" "}
							<span class="text-xs">
								<kbd class="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
									⌘
								</kbd>{" "}
								<span>+</span>{" "}
								<kbd class="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
									↵
								</kbd>
							</span>
						</div>
					</div>
				</footer>
			</body>
		</>
	);
}
