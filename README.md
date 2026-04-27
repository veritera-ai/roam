# ROAM — Republic of Autonomous Machines

**Cross-framework agent orchestration, protected by [EYDII](https://github.com/veritera-ai/eydii).**

ROAM is the first agent operating system — a coordination layer that lets AI agents from different frameworks work together as an organization, with built-in behavioral intelligence from [EYDII](https://github.com/veritera-ai/eydii), the trust layer for autonomous systems.

---

## What ROAM Does

ROAM turns a collection of independent AI agents into a coordinated team. It handles:

- **Multi-framework orchestration** — Run agents from 30+ frameworks (Claude Code, OpenAI, Cursor, LangChain, CrewAI, OpenClaw, and more) side by side, in the same session
- **Organizational topology** — CEO type, captain, mesh, or department structures. Agents have names, roles, job descriptions, and reporting relationships
- **Agent memory** — Canon (facts, decisions, judgments), journals, and shared archive that persist across sessions
- **Behavioral intelligence** — Powered by [EYDII](https://github.com/veritera-ai/eydii). Every agent is baselined from its first action. Drift is detected automatically. Content-blind — ROAM never inspects what agents produce, only how they behave
- **Auto-swap** — When an agent degrades, ROAM swaps it with a fresh instance in 90 seconds, preserving memory and context
- **Peer accountability** — Agents report concerns about teammates. These feed into health assessments
- **Cost tracking** — Per-framework API usage breakdown with budget ceilings and alerts
- **ROAM Live** — Real-time feed showing agents talking to each other in natural language
- **Remote management** — Control your team from Telegram or Discord

## 30 Supported Frameworks

| Framework | Framework | Framework |
|-----------|-----------|-----------|
| Claude Code | Claude Cowork | OpenAI |
| ChatGPT | Cursor | LangChain |
| LangGraph | CrewAI | AutoGen |
| n8n | Agno | Mastra |
| Google ADK | Ollama | LM Studio |
| Open WebUI | OpenRouter | Windsurf |
| Cline | Aider | GitHub Copilot |
| Amazon Bedrock | Azure OpenAI | Groq |
| DeepSeek | Mistral | Perplexity |
| Replit Agent | Devin | OpenClaw |

Local frameworks (Ollama, LM Studio, Open WebUI, OpenClaw) require no API key.

## Install

```bash
npm install -g @veritera.ai/roam
```

```bash
roam init my-project
```

The 13-step setup wizard configures everything: project type, leadership style, frameworks, API keys, team composition, budget, approval gates, notifications, and runtime mode. No code required.

## Architecture

ROAM is a daemon-based system with 24 subsystems:

```
┌─────────────────────────────────────┐
│           Control Room              │  ← Browser dashboard (14 views)
├─────────────────────────────────────┤
│         ROAM Daemon                 │  ← Long-running process
│  ┌──────────┬──────────┬──────────┐ │
│  │ Steward  │ Adoption │  Cost    │ │
│  │ Kernel   │ Engine   │  Engine  │ │
│  ├──────────┼──────────┼──────────┤ │
│  │ Channel  │  Task    │  Drift   │ │
│  │ Manager  │ Manager  │  Engine  │ │
│  ├──────────┼──────────┼──────────┤ │
│  │ Lifecycle│  Canon   │  EYDII   │ │
│  │ Manager  │ (Memory) │  Trust   │ │
│  └──────────┴──────────┴──────────┘ │
├─────────────────────────────────────┤
│      Protocol Layer (IPC)           │  ← Unix domain socket
└─────────────────────────────────────┘
```

The daemon communicates over Unix domain sockets. The Control Room is a browser-based dashboard served locally. EYDII behavioral intelligence is embedded and non-optional — every agent is monitored from its first action.

## CLI Commands

```
roam init <name>        Initialize a new session
roam status             Session overview
roam agent list         List agents and their states
roam agent add          Add an agent to the team
roam task create        Create a task
roam task list          Active tasks
roam drift sweep        Run drift analysis
roam cost               API usage and budget status
roam live               ROAM Live feed
roam telegram setup     Configure Telegram notifications
roam discord setup      Configure Discord notifications
roam gui                Open Control Room in browser
```

27 commands total. Run `roam help` for the full list.

## Trust Layer

ROAM ships with [EYDII](https://github.com/veritera-ai/eydii) embedded — the trust layer for autonomous systems.

- **Content-blind** — Never inspects agent output. Works in regulated environments (HIPAA, defense, multi-tenant) where content inspection is forbidden
- **Behavioral baselining** — Every agent's job description is hashed. Behavioral patterns are tracked from the first action
- **Drift detection** — Continuous monitoring with configurable thresholds
- **Mathematical attestation** — Every action is mathematically signed. Every denial is recorded with proof
- **Three layers** — Sidecar (runtime interception) → Engine (behavioral analysis) → Proof (mathematical verification)

Learn more: [EYDII — The Trust Layer for Autonomous Systems](https://github.com/veritera-ai/eydii)

## Packages

This repository contains the ROAM protocol specification and developer SDK:

| Package | Description |
|---------|-------------|
| [`@roam/protocol`](./packages/protocol) | Types, schemas, constants, and validation for the ROAM coordination protocol |
| [`@roam/sdk`](./packages/sdk) | Developer SDK for building framework integrations and extensions |

## Building Integrations

Use the SDK to connect a new framework to ROAM:

```typescript
import { ROAMAgent } from "@roam/sdk";

const agent = new ROAMAgent({
  name: "my-agent",
  framework: "my-framework",
  role: "researcher",
});

// Register with the daemon
await agent.register();

// Report actions for behavioral baselining
await agent.reportAction("web_search", { query: "market analysis" });

// Read tasks assigned to this agent
const tasks = await agent.getTasks();
```

See [`packages/sdk`](./packages/sdk) for the full API reference.

## Links

- **[EYDII — Trust Layer](https://github.com/veritera-ai/eydii)** — The behavioral intelligence engine embedded in ROAM
- **[Veritera Corporation](https://veritera.ai)** — The company behind ROAM and EYDII

## License

Copyright 2026 Veritera Corporation. All rights reserved.

The protocol specification and SDK in this repository are available under the [MIT License](./LICENSE). The ROAM daemon, Control Room, and EYDII trust layer are proprietary.
