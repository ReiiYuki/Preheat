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
