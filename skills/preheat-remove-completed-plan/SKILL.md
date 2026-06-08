---
name: preheat-remove-completed-plan
description: "Remove a plan from Preheat after it has been completed. Use this skill when the user has finished working on a plan and wants to clean it up, archive it, or remove it from the project board."
---

# Remove Plan After Completion

This skill removes a plan from Preheat after the work has been completed. It verifies the plan exists, confirms with the user, and then deletes it using the MCP server.

## Prerequisites

- Preheat MCP server must be configured and accessible
- The plan to remove must exist in Preheat

## Workflow

### Step 1: Identify the plan to remove

If the user specifies a plan by name, first fetch all plans to find the matching ID:

```
Tool: get_all_plans
Arguments: {}
```

Search the results for a plan matching the user's description by title or content.

### Step 2: Confirm the plan details

Before removing, display the plan details to the user for confirmation:

```
I found the following plan to remove:

**Title:** Feature: Dark Mode
**Project:** My App
**Created:** June 8, 2025
**Last Updated:** June 8, 2025

Content preview:
> Implement dark mode toggle in settings...

Are you sure you want to remove this plan? This action cannot be undone.
```

> **Warning**: Plan removal is permanent. There is no undo or archive feature. Always confirm with the user before proceeding.

### Step 3: Remove the plan

Use the `remove_plan` MCP tool:

```
Tool: remove_plan
Arguments: { "planId": "<plan-id>" }
```

The tool returns a success message: `Successfully removed plan <plan-id>`

### Step 4: Verify removal

Optionally, call `get_all_plans` again to verify the plan no longer appears in the list.

## Batch Removal

To remove multiple completed plans at once:

1. Fetch all plans with `get_all_plans`
2. Identify completed plans (by content analysis or user selection)
3. Confirm the list with the user
4. Remove each plan sequentially:

```
Tool: remove_plan
Arguments: { "planId": "<plan-id-1>" }

Tool: remove_plan
Arguments: { "planId": "<plan-id-2>" }
```

## Safety Guidelines

1. **Always confirm before removing** — Never auto-remove plans without user confirmation
2. **Check plan content first** — Verify the plan is actually completed by reading its content
3. **Consider editing instead** — If the plan has reusable information, suggest using `edit_plan` to mark it as done rather than removing it entirely
4. **One at a time** — When removing multiple plans, confirm each one individually unless the user explicitly asks for batch removal

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `get_all_plans` | List all plans to find the one to remove |
| `get_all_plans_by_project` | Get plans for a specific project |
| `remove_plan` | Remove a plan by its ID |
| `edit_plan` | Alternative: mark as done instead of removing |
