// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/api/count.ts";
import * as $1 from "./routes/api/messages.ts";
import * as $2 from "./routes/api/ping.ts";
import * as $3 from "./routes/index.tsx";
import * as $4 from "./routes/messages.tsx";
import * as $$0 from "./islands/Counter.tsx";
import * as $$1 from "./islands/MessageList.tsx";
import * as $$2 from "./islands/SocketCounter.tsx";
import * as $$3 from "./islands/SocketPing.tsx";

const manifest = {
	routes: {
		"./routes/api/count.ts": $0,
		"./routes/api/messages.ts": $1,
		"./routes/api/ping.ts": $2,
		"./routes/index.tsx": $3,
		"./routes/messages.tsx": $4,
	},
	islands: {
		"./islands/Counter.tsx": $$0,
		"./islands/MessageList.tsx": $$1,
		"./islands/SocketCounter.tsx": $$2,
		"./islands/SocketPing.tsx": $$3,
	},
	baseUrl: import.meta.url,
	config,
};

export default manifest;
