# Preheat ♨️

**Preheat** is a local-first, privacy-focused productivity tool and scratchpad designed to help you prepare your thoughts before jumping into work. *Don't wait. Warm the prompt.*

## What is Preheat?
Preheat provides a distraction-free, instantaneous environment to outline projects, write specifications, and draft prompts for AI tools. Instead of opening a heavy IDE or a cloud-based document editor, you can instantly open Preheat and start typing.

All your data is stored locally on your machine—no accounts, no cloud sync delays, and complete privacy. Preheat operates as both a web application and a native desktop app powered by Tauri.

## Features
- 🚀 **Instant Launch & Local First**: Data is stored entirely locally. Zero latency, works offline.
- 🔗 **Bi-directional Linking**: Type `[[` to instantly link to other plans or create new ones on the fly.
- ⚡ **Slash Commands**: Type `/` to insert headings, bullet points, checklists, and dividers without taking your hands off the keyboard.
- 🎨 **Modern Interface**: Beautiful, rounded gradient UI with smooth transitions and a native feel.
- 🤖 **Local MCP Server Integration**: When running as a native desktop app, Preheat can run a Model Context Protocol (MCP) server, allowing external AI agents (like Claude Desktop) to read and edit your Preheat plans directly!
- ⚙️ **Autostart Support**: Configure the app to launch automatically when your computer starts.

## How to Use the Product
1. **Create a Project**: Organize your thoughts by creating projects in the left sidebar.
2. **Write Plans**: Inside a project, create "plans" (documents) and use Markdown to format them.
3. **Link Ideas**: Use `[[` to mention or create new plans within the same project.
4. **Desktop App**: For the best experience, run the Preheat desktop app to utilize the MCP server and system-wide autostart.

## How to Develop

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/) (for building the Tauri desktop app)

### Setup & Installation
Clone the repository and install dependencies:
```bash
pnpm install
```

### Running Locally
To run the web app in development mode:
```bash
pnpm dev
```

To run the native desktop app (Tauri) in development mode:
```bash
pnpm tauri dev
```

### Building for Production
To build the web application:
```bash
pnpm build
```

To build the standalone native desktop app installer:
```bash
pnpm tauri build
```

### Running Tests
Preheat uses Vitest for unit testing and Playwright for end-to-end testing.
```bash
# Run unit tests
pnpm test

# Run End-to-End tests
pnpm test:e2e
```

### MCP Server
The Model Context Protocol (MCP) server allows AI agents to interact with Preheat's local state. 
- Source code is located at `scripts/mcp-server/index.ts`.
- It can be run manually via `pnpm mcp`.
- The native Tauri app automatically launches it in the background if enabled in settings.

## Agent Skills

Preheat ships with predefined agent skills that can be installed into your AI coding assistant via [agent-skills-cli](https://github.com/nichochar/agent-skills-cli) or manually.

### Available Skills

| Skill | Description |
|-------|-------------|
| `preheat-connect-project` | Connect your current project/codebase to a Preheat plan |
| `preheat-pick-pending-plan` | Pick a pending plan to continue working on |
| `preheat-remove-completed-plan` | Remove a plan after it has been completed |

### Install via agent-skills-cli

```bash
# Install agent-skills-cli if you haven't already
npm install -g agent-skills-cli

# Pull all Preheat skills into your project
agent-skills pull github.com/ReiiYuki/Preheat/skills
```

### Manual Installation

Copy the skill files from the `skills/` directory into your agent's skill configuration directory:

```bash
# Example: Copy to Gemini CLI skills directory
cp -r skills/preheat-connect-project ~/.gemini/config/skills/
cp -r skills/preheat-pick-pending-plan ~/.gemini/config/skills/
cp -r skills/preheat-remove-completed-plan ~/.gemini/config/skills/
```

Each skill folder contains a `SKILL.md` file with YAML frontmatter (name, description) and step-by-step instructions that your AI agent will follow automatically.

### Skill Manifest

The `skills/skills.json` file serves as a discovery manifest containing all available skills and the MCP server configuration. CLI tools can use this to auto-configure skills and MCP connections.

## Troubleshooting

### macOS App Cannot Be Opened ("Apple could not verify...")
Because Preheat is currently an unsigned open-source application, Apple's Gatekeeper automatically blocks it by default. To open the app:

**Option 1 (Recommended)**
1. Open **Finder** and navigate to your **Applications** folder.
2. **Right-click** (or `Control` + Click) on the **Preheat** app icon.
3. Select **Open** from the context menu.
4. Click the **Open** button in the warning dialog. The app will launch normally from then on.

**Option 2 (Terminal)**
If the first method doesn't work, you can clear the quarantine flag via terminal:
```bash
xattr -cr /Applications/Preheat.app
```

### Windows App Blocked ("Windows protected your PC")
Because Preheat is currently an unsigned open-source application, Microsoft SmartScreen may show a warning when you try to install or run it. To install:
1. Click **More info** on the blue warning dialog.
2. Click the **Run anyway** button that appears.

### Linux AppImage Setup
Linux AppImages need to be marked as executable before they can be run:
1. Right-click the downloaded `.AppImage` file and select **Properties**.
2. Go to the **Permissions** tab and check **Allow executing file as program**.
3. Double-click the file to run it. 
*(Alternatively, run `chmod +x filename.AppImage` in your terminal).*

### MCP Server Connection Issues (Cursor & AI Clients)
If your AI client (like Cursor) fails to connect to the Preheat MCP Server or shows 0 tools:
1. Ensure **Local MCP Server Sync** is enabled in the Preheat desktop app Settings.
2. Click the **"Restart Server"** button inside Preheat's settings to force the local background process to refresh.
3. In your AI client, ensure the URL (`http://127.0.0.1:4710/sse`) or the absolute command path is exactly correct.
4. If the client seems stuck, **toggle the MCP connection OFF and back ON** in your client to force it to reconnect.
