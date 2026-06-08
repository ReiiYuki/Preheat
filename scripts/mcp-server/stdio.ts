#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./index.js";

const transport = new StdioServerTransport();

async function run() {
  await server.connect(transport);
}

run().catch((error) => {
  console.error("Fatal error connecting to stdio transport:", error);
  process.exit(1);
});
