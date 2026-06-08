---
name: preheat-connect-project
description: "Connect the current working project/codebase to a Preheat plan. Use this skill when the user wants to link their current project directory to an existing or new plan in Preheat for tracking development work, feature planning, or task management."
---

# Connect Current Project to Plan

This skill connects your current working project/codebase to a plan in Preheat. It uses the Preheat MCP server to look up existing projects and plans, then creates or links a plan to track the current work.

## Prerequisites

- Preheat desktop app must be installed and have been opened at least once (to create the state file)
- Preheat MCP server must be configured in your MCP client (e.g., Claude Desktop, Cursor, etc.)

### MCP Configuration

Add the following to your MCP client configuration:

**Stdio mode (recommended):**
```json
{
  "mcpServers": {
    "preheat": {
      "command": "node",
      "args": ["/path/to/preheat/src-tauri/mcp-server.cjs", "--stdio"]
    }
  }
}
```

**SSE mode:**
```json
{
  "mcpServers": {
    "preheat": {
      "url": "http://127.0.0.1:4710/sse"
    }
  }
}
```

## Workflow

### Step 1: List existing projects and plans

Use the `get_all_plans` MCP tool to see all available projects and their plans:

```
Tool: get_all_plans
Arguments: {}
```

This returns a JSON array of all plans with their `projectId`, `projectName`, `id`, `title`, `content`, `createdAt`, and `updatedAt`.

### Step 2: Identify or create the target project

From the results, identify the project that matches your current codebase. If no matching project exists, you'll need to create one through the Preheat UI first.

> **Note**: Project creation is currently only available through the Preheat desktop/web UI. Plans can be created via MCP.

### Step 3: Create a new plan linked to the project

Use the `create_plan` MCP tool to create a plan that describes the current project context:

```
Tool: create_plan
Arguments: {
  "projectId": "<target-project-id>",
  "title": "<descriptive-title>",
  "content": "<plan-content-in-html>"
}
```

**Best practices for plan content:**
- Include the project directory path for reference
- Describe the current state of the codebase
- List the goals or features being worked on
- Use HTML formatting for structure (Preheat uses Tiptap editor which stores HTML)

### Example content template

```html
<h2>Project Connection</h2>
<p><strong>Directory:</strong> /path/to/your/project</p>
<p><strong>Repository:</strong> github.com/user/repo</p>
<h2>Current State</h2>
<p>Description of what the project does and its current status.</p>
<h2>Goals</h2>
<ul>
  <li>Goal 1</li>
  <li>Goal 2</li>
</ul>
```

### Step 4: Verify the connection

Use `get_all_plans_by_project` to confirm the plan was created:

```
Tool: get_all_plans_by_project
Arguments: { "projectId": "<target-project-id>" }
```

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `get_all_plans` | List all plans across all projects |
| `get_all_plans_by_project` | Get plans for a specific project |
| `create_plan` | Create a new plan in a project |
| `edit_plan` | Update an existing plan |
| `remove_plan` | Remove a plan |
