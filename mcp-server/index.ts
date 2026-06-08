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

const STATE_FILE = path.join(getAppDataPath(), "state.json");

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
        name: "get_projects",
        description: "List all projects and their plan titles",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_plans",
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
        name: "add_plan",
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
        name: "update_plan",
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
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    const state = await getState();

    if (name === "get_projects") {
      const summary = state.projects.map(p => ({
        id: p.id,
        name: p.name,
        plans: p.plans.map(pl => ({ id: pl.id, title: pl.title }))
      }));
      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      };
    }

    if (name === "get_plans") {
      const projectId = args?.projectId as string;
      const project = state.projects.find(p => p.id === projectId);
      if (!project) throw new Error("Project not found");
      return {
        content: [{ type: "text", text: JSON.stringify(project.plans, null, 2) }],
      };
    }

    if (name === "add_plan") {
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
        content: [{ type: "text", text: `Successfully added plan '${title}' with ID ${newPlan.id}` }],
      };
    }

    if (name === "update_plan") {
      const planId = args?.planId as string;
      const title = args?.title as string;
      const content = args?.content as string;
      
      let found = false;
      for (const project of state.projects) {
        const plan = project.plans.find(pl => pl.id === planId);
        if (plan) {
          plan.title = title;
          plan.content = content;
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

    throw new Error(`Unknown tool: ${name}`);
  } catch (err: any) {
    return {
      content: [{ type: "text", text: `Error: ${err.message}` }],
      isError: true,
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Preheat MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
