import { useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

interface CounterProps {
	start: number;
}

/**
 * @param increment true to increment, false to decrement
 */
async function fetchSetCount(increment: boolean) {
	return await fetch(`/api/count?increment=${increment}`, { method: "POST" });
}

export default function Counter(props: CounterProps) {
	const [count, setCount] = useState(props.start);
	return (
		<div class="flex items-center gap-2 w-full">
			<p class="flex-grow-1 text-lg font-mono">{count}</p>
			<Button
				onClick={async () => {
					const newCount = count - 1;
					const resp = await fetchSetCount(false);
					if (resp.ok) {
						setCount(newCount);
					}
				}}
			>
				-1
			</Button>
			<Button
				onClick={async () => {
					const newCount = count + 1;
					const resp = await fetchSetCount(true);
					if (resp.ok) {
						setCount(newCount);
					}
				}}
			>
				+1
			</Button>
		</div>
	);
}
