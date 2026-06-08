---
name: preheat-pick-pending-plan
description: "Pick a pending plan from Preheat to continue working on. Use this skill when the user wants to resume work on an existing plan, check what plans are available, or select the next task to proceed with from their Preheat project board."
---

# Pick Pending Plan to Continue

This skill retrieves all pending plans from Preheat and helps the agent pick one to continue working on. It reads plan content to understand the requirements and context before proceeding.

## Prerequisites

- Preheat MCP server must be configured and accessible
- At least one project with plans must exist in Preheat

## Workflow

### Step 1: Fetch all plans

Use the `get_all_plans` MCP tool to retrieve every plan across all projects:

```
Tool: get_all_plans
Arguments: {}
```

The response is a JSON array. Each entry contains:

```json
{
  "projectId": "uuid",
  "projectName": "My Project",
  "id": "plan-uuid",
  "title": "Feature: Dark Mode",
  "content": "<p>HTML content of the plan...</p>",
  "createdAt": 1718000000000,
  "updatedAt": 1718000000000
}
```

### Step 2: Identify pending plans

A plan is considered **pending** if it has not been marked as completed. Since Preheat plans are freeform documents, look for these signals to determine status:

1. **Content analysis**: Check if the plan content contains completion markers like:
   - `[x]` or `✅` checkboxes that are all checked
   - Words like "completed", "done", "finished" in the title
   - A status field indicating completion

2. **Recency**: Plans with recent `updatedAt` timestamps may be actively in progress

3. **Content richness**: Plans with detailed content are more likely to be actionable

### Step 3: Present options to the user

If multiple pending plans exist, present them as a numbered list:

```
I found the following pending plans:

1. **Feature: Dark Mode** (Project: My App)
   Last updated: 2 hours ago
   
2. **Bug: Login timeout** (Project: My App)
   Last updated: 1 day ago

Which plan would you like to continue working on?
```

### Step 4: Load the selected plan

Once the user picks a plan, read its full content to understand the requirements. If you need the full project context, use `get_all_plans_by_project`:

```
Tool: get_all_plans_by_project
Arguments: { "projectId": "<project-id>" }
```

### Step 5: Parse plan content and begin work

The plan `content` field is HTML (from the Tiptap editor). Parse it to extract:

- **Task lists**: `<ul data-type="taskList">` contains checkbox items
- **Headers**: `<h1>`, `<h2>`, etc. define sections
- **Paragraphs**: `<p>` tags contain descriptions
- **Code blocks**: `<pre><code>` contain code snippets or commands
- **Links**: `<a>` tags may reference files, URLs, or resources

Use the extracted information to understand what needs to be done and proceed with implementation.

## Tips

- **Sort by priority**: If plans have priority markers in their titles (e.g., `[P0]`, `[HIGH]`), sort by priority
- **Filter by project**: If the user is in a specific project directory, filter plans to only show relevant ones using `get_all_plans_by_project`
- **Track progress**: After picking a plan, update it with progress using `edit_plan` to mark what has been started

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `get_all_plans` | List all plans across all projects |
| `get_all_plans_by_project` | Get plans for a specific project |
| `edit_plan` | Update plan content with progress |
