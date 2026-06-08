# Preheat MCP Server

This is the Model Context Protocol (MCP) server for the Preheat desktop application.
It allows external AI agents (like Claude Desktop or Cursor) to read your Preheat projects and plans, and even create or update plans directly on your local file system.

## Setup Instructions

1. **Enable MCP Sync in Preheat**:
   Open the Preheat desktop app, click **⚙ Settings** in the bottom left of the sidebar, and turn on the "Local MCP Server Sync" toggle.

2. **Install Dependencies**:
   If you are running the server manually from source, navigate to this directory and install dependencies:
   ```bash
   npm install
   ```

3. **Configure your Agent**:
   Add the following configuration to your AI agent's settings (e.g., `claude_desktop_config.json` for Claude Desktop).
   
   Replace `/absolute/path/to/Preheat` with the actual path to your Preheat project directory.

   ```json
   {
     "mcpServers": {
       "preheat": {
         "command": "npx",
         "args": ["tsx", "/absolute/path/to/Preheat/mcp-server/index.ts"]
       }
     }
   }
   ```

## How it Works
The MCP server reads and writes to the local `state.json` file managed by the Preheat desktop app (located in your OS's AppData directory). Thanks to Tauri's file watcher, any edits made by the AI agent will instantly appear in the Preheat UI.
