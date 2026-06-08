#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import * as crypto from "crypto";

// Determine the state file path based on OS (matching Tauri's appDataDir)
function getAppDataPath() {
  const home = os.homedir();
  const appId = "com.reiiyuki.preheat";
  
  if (process.platform === "darwin") {
    return path.join(home, "Library", "Application Support", appId);
  } else if (process.platform === "win32") {
    return path.join(process.env.APPDATA || path.join(home, "AppData", "Roaming"), appId);
  } else {
    // Linux and others
    return path.join(process.env.XDG_DATA_HOME || path.join(home, ".local", "share"), appId);
  }
}

const STATE_FILE = process.env.STATE_FILE || path.join(getAppDataPath(), "state.json");

// Define AppState interfaces to match the frontend
interface Plan {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface Project {
  id: string;
  name: string;
  plans: Plan[];
  createdAt: number;
}

interface AppState {
  user: { name: string } | null;
  projects: Project[];
  activeProjectId: string | null;
  activePlanId: string | null;
  hasSeenTutorial?: boolean;
}

async function getState(): Promise<AppState> {
  try {
    const data = await fs.readFile(STATE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      throw new Error(`State file not found at ${STATE_FILE}. Please open the Preheat desktop app first.`);
    }
    throw err;
  }
}

async function saveState(state: AppState): Promise<void> {
  await fs.mkdir(path.dirname(STATE_FILE), { recursive: true });
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
}

function uuid(): string {
  return crypto.randomUUID();
}

function now(): number {
  return Date.now();
}

function createServer() {
  const server = new Server(
    {
      name: "preheat-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "get_all_plans",
          description: "Get a list of all plans across all projects",
          inputSchema: {
            type: "object",
            properties: {
              _dummy: {
                type: "string",
                description: "Ignore this parameter"
              }
            },
          },
        },
        {
          name: "get_all_plans_by_project",
          description: "Get full contents of all plans in a specific project",
          inputSchema: {
            type: "object",
            properties: {
              projectId: {
                type: "string",
                description: "The ID of the project to get plans for",
              },
            },
            required: ["projectId"],
          },
        },
        {
          name: "create_plan",
          description: "Add a new plan to a project",
          inputSchema: {
            type: "object",
            properties: {
              projectId: { type: "string" },
              title: { type: "string" },
              content: { type: "string" },
            },
            required: ["projectId", "title", "content"],
          },
        },
        {
          name: "edit_plan",
          description: "Update the title and content of an existing plan",
          inputSchema: {
            type: "object",
            properties: {
              planId: { type: "string" },
              title: { type: "string" },
              content: { type: "string" },
            },
            required: ["planId", "title", "content"],
          },
        },
        {
          name: "remove_plan",
          description: "Remove a plan from a project by its plan ID",
          inputSchema: {
            type: "object",
            properties: {
              planId: { type: "string" },
            },
            required: ["planId"],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      return await handleCallTool(name, args);
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true,
      };
    }
  });

  return server;
}

export async function handleCallTool(name: string, args: any) {
  const state = await getState();

  if (name === "get_all_plans") {
    const allPlans = state.projects.flatMap(p => 
      p.plans.map(pl => ({ projectId: p.id, projectName: p.name, ...pl }))
    );
    return {
      content: [{ type: "text", text: JSON.stringify(allPlans, null, 2) }],
    };
  }

  if (name === "get_all_plans_by_project") {
    const projectId = args?.projectId as string;
    const project = state.projects.find(p => p.id === projectId);
    if (!project) throw new Error("Project not found");
    return {
      content: [{ type: "text", text: JSON.stringify(project.plans, null, 2) }],
    };
  }

  if (name === "create_plan") {
    const projectId = args?.projectId as string;
    const title = args?.title as string;
    const content = args?.content as string;
    
    const projectIndex = state.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) throw new Error("Project not found");

    const newPlan: Plan = {
      id: uuid(),
      title,
      content,
      createdAt: now(),
      updatedAt: now()
    };
    
    state.projects[projectIndex].plans.push(newPlan);
    await saveState(state);
    
    return {
      content: [{ type: "text", text: `Successfully created plan '${title}' with ID ${newPlan.id}` }],
    };
  }

  if (name === "edit_plan") {
    const planId = args?.planId as string;
    const title = args?.title as string;
    const content = args?.content as string;
    
    let found = false;
    for (const project of state.projects) {
      const plan = project.plans.find(pl => pl.id === planId);
      if (plan) {
        if (title !== undefined) plan.title = title;
        if (content !== undefined) plan.content = content;
        plan.updatedAt = now();
        found = true;
        break;
      }
    }
    
    if (!found) throw new Error("Plan not found");
    
    await saveState(state);
    
    return {
      content: [{ type: "text", text: `Successfully updated plan ${planId}` }],
    };
  }

  if (name === "remove_plan") {
    const planId = args?.planId as string;
    
    let found = false;
    for (const project of state.projects) {
      const initialLength = project.plans.length;
      project.plans = project.plans.filter(pl => pl.id !== planId);
      if (project.plans.length < initialLength) {
        found = true;
        break;
      }
    }
    
    if (!found) throw new Error("Plan not found");
    
    await saveState(state);
    
    return {
      content: [{ type: "text", text: `Successfully removed plan ${planId}` }],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
}



import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

export { getState, saveState };

let serverInstance: any = null;
const transports = new Map<string, SSEServerTransport>();

export async function run() {
  if (process.argv.includes('--stdio')) {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    return;
  }

  const app = new Hono();
  
  app.use('*', cors());
  
  app.get('/sse', async (c) => {
    const { outgoing } = c.env as any;
    const transport = new SSEServerTransport('/message', outgoing as any);
    const server = createServer();
    await server.connect(transport);
    
    transports.set(transport.sessionId, transport);
    
    transport.onclose = () => {
      transports.delete(transport.sessionId);
    };

    return new Promise<Response>(() => {});
  });
  
  app.post('/message', async (c) => {
    const { incoming, outgoing } = c.env as any;
    const sessionId = c.req.query('sessionId');
    
    if (!sessionId) {
      return c.text("Missing sessionId", 400);
    }
    
    const transport = transports.get(sessionId);
    if (!transport) {
      return c.text("Session not found", 404);
    }
    
    await transport.handlePostMessage(incoming, outgoing);
    return new Promise<Response>(() => {});
  });

  const port = Number(process.env.PORT) || 4710;
  
  return new Promise((resolve) => {
    serverInstance = serve({
      fetch: app.fetch,
      port,
      hostname: '127.0.0.1'
    }, (info) => {
      console.error(`Preheat MCP Server running on SSE at http://127.0.0.1:${info.port}/sse`);
      resolve(serverInstance);
    });
  });
}

export async function stop() {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
  }
}

if (process.argv[1] && process.argv[1].includes("mcp-server/index") || process.argv.includes("--stdio") || process.argv[1]?.endsWith('mcp-server.cjs')) {
  run().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
  });
}
