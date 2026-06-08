import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';

test.describe('MCP Server E2E', () => {
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
        plans: []
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
    } catch (e) {
      // ignore
    }
  });

  test('should process JSON-RPC messages via stdio', async () => {
    // Spawn the MCP server via tsx
    mcpProcess = spawn('npx', ['tsx', 'scripts/mcp-server/index.ts'], {
      env: { ...process.env, STATE_FILE: stateFile },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // We will collect stdout data and check for valid JSON-RPC responses
    const sendRequest = (request: any): Promise<any> => {
      return new Promise((resolve, reject) => {
        const messageHandler = (data: Buffer) => {
          const lines = data.toString().split('\n').filter(Boolean);
          for (const line of lines) {
            try {
              const response = JSON.parse(line);
              if (response.id === request.id) {
                mcpProcess.stdout.off('data', messageHandler);
                resolve(response);
              }
            } catch (e) {
              // Ignore non-json or incomplete chunks
            }
          }
        };

        mcpProcess.stdout.on('data', messageHandler);
        
        // MCP SDK JSON-RPC format expects a single JSON object per line
        mcpProcess.stdin.write(JSON.stringify(request) + '\n');
        
        // Timeout
        setTimeout(() => {
          mcpProcess.stdout.off('data', messageHandler);
          reject(new Error('Timeout waiting for MCP response'));
        }, 5000);
      });
    };

    // Initialize MCP Server (required by SDK)
    const initResponse = await sendRequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'e2e-test', version: '1.0.0' }
      }
    });
    expect(initResponse.result.protocolVersion).toBeDefined();

    // Must send initialized notification
    mcpProcess.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      method: 'notifications/initialized'
    }) + '\n');

    // Call get_projects tool
    const callResponse = await sendRequest({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'get_projects',
        arguments: {}
      }
    });

    expect(callResponse.result.content).toBeDefined();
    expect(callResponse.result.content[0].text).toContain('E2E Project');
  });
});
