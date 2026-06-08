import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

test.describe('MCP Server E2E (SSE)', () => {
  let mcpProcess: any;
  let stateFile: string;

  test.beforeAll(async () => {
    stateFile = path.join(os.tmpdir(), `preheat-e2e-state-${Date.now()}.json`);
    
    // Create initial state for testing
    await fs.writeFile(stateFile, JSON.stringify({
      user: null,
      projects: [{
        id: 'e2e-proj-1',
        name: 'E2E Project',
        createdAt: Date.now(),
        plans: [
          {
            id: 'e2e-plan-1',
            title: 'E2E Test Plan',
            content: 'Test content',
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        ]
      }],
      activeProjectId: null,
      activePlanId: null
    }));
  });

  test.afterAll(async () => {
    if (mcpProcess) {
      mcpProcess.kill();
    }
    try {
      await fs.unlink(stateFile);
    } catch {
      // ignore
    }
  });

  test('should process JSON-RPC messages via SSE', async () => {
    // Spawn the MCP server via tsx
    const port = Math.floor(Math.random() * 10000) + 10000; // random port between 10000-20000
    mcpProcess = spawn('npx', ['tsx', 'scripts/mcp-server/index.ts'], {
      env: { ...process.env, STATE_FILE: stateFile, PORT: port.toString() },
      stdio: 'inherit'
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    const transport = new SSEClientTransport(new URL(`http://127.0.0.1:${port}/sse`));
    
    const client = new Client({
      name: "e2e-test-client",
      version: "1.0.0",
    }, {
      capabilities: {}
    });

    await client.connect(transport);

    const callResponse = await client.callTool({
      name: "get_all_plans",
      arguments: {}
    });

    expect(callResponse.content).toBeDefined();
    expect(callResponse.content[0].type).toBe('text');
    expect((callResponse.content[0] as any).text).toContain('E2E Test Plan');

    // Clean up client
    await transport.close();
  });
});
