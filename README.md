<p align="center">
  <strong>The agentic OS for autonomous systems.</strong>
</p>

<p align="center">
  Trustless. Heterogeneous. Local.<br />
  Identity for every agent, persistent shared memory across runtimes, and behavioral intelligence that catches drift before it ships.
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://www.npmjs.com/package/@veritera.ai/roam"><img src="https://img.shields.io/npm/v/@veritera.ai/roam.svg" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/frameworks-30-brightgreen" alt="30 Frameworks" />
  <img src="https://img.shields.io/badge/TypeScript-100%25-3178C6" alt="TypeScript" />
</p>

---

## Why ROAM Exists

You have agents on Claude Code, n8n, LangChain, and CrewAI. They run on different runtimes, speak different protocols, and have no idea the others exist. When one drifts, the rest keep going. When one finishes, nobody picks up the next task. There is no shared memory, no identity, no lifecycle, no governance. You are the operating system — and you don't scale.

**ROAM** (Republic of Autonomous Machines) is the operating system for autonomous agents. Not a wrapper. Not a framework. An OS — with a file system, persistent memory, identity, governance, behavioral intelligence, lifecycle management, a coordination kernel, and a desktop application. Eight layers, each doing something different, all working together. 14 packages, 52,667 lines of TypeScript, 30 frameworks, one protocol.

For the first time, agents from different frameworks talk to each other — and you can watch it happen live.

## Quick Start

```bash
npm install -g @veritera.ai/roam
```

```bash
# Initialize a new ROAM workspace
roam init my-workspace

# Register an agent
roam agent add --name analyst --framework langchain

# Register a second agent on a different framework
roam agent add --name reviewer --framework crewai

# Start the OS
roam start
```

ROAM runs entirely on your machine. No cloud accounts, no API keys, no telemetry.

## Eight Layers. One OS.

### L01 — File System
Every agent reads and writes files. ROAM builds on this universal primitive — a shared file-based protocol that works across 30 frameworks without custom integrations.

### L02 — Persistent Memory
Agents forget. Context windows fill, models swap, sessions end. ROAM's memory layer outlives every agent that writes to it. Shared state that persists across runtimes, across swaps, across time.

### L03 — Identity and Security
Every agent gets a cryptographic identity, a job description, and a signed constitution. Privacy-first — agents see only what their role permits.

### L04 — Rules and Governance
Behavioral boundaries defined by the operator, enforced by the system. Not suggestions — rules. Signed, versioned, tamper-evident.

### L05 — The Coordination Kernel
An invisible process that manages agent conversations, task routing, escalation, and self-healing. The kernel that makes the OS an OS.

### L06 — Behavioral Intelligence
Peer-based drift detection, not self-reporting. Agents observe each other. Every agent carries a Trust Score — healthy or unhealthy, measured continuously, not checked once at deployment.

### L07 — ROAM Live
Agents from any framework talking to each other in natural language — and you can watch it happen in real time. A live feed of your autonomous team working, coordinating, flagging concerns, and making decisions.

### L08 — Desktop Application
Native app built on Tauri v2. Full GUI, 27 CLI commands, Telegram and Discord notifications. No browser required.

## Architecture

```
+------------------------------------------------------------------+
|  L08  Desktop Application + CLI (Tauri v2, 27 commands)          |
+------------------------------------------------------------------+
|  L07  ROAM Live (real-time cross-framework feed)                 |
+------------------------------------------------------------------+
|  L06  Behavioral Intelligence + Trust Score                      |
+------------------------------------------------------------------+
|  L05  Coordination Kernel (Steward)                              |
+------------------------------------------------------------------+
|  L04  Rules and Governance (signed constitution)                 |
+------------------------------------------------------------------+
|  L03  Identity and Security                                      |
+------------------------------------------------------------------+
|  L02  Persistent Memory                                          |
+------------------------------------------------------------------+
|  L01  File System Protocol (30 frameworks)                       |
+------------------------------------------------------------------+
|  EYDII  Trust Layer (content-blind, trustless, mathematical)     |
+------------------------------------------------------------------+
```

This repository contains the protocol specification and SDK. The engine source code is in a private repository and distributed as compiled packages via npm.

## Supported Frameworks

### Coding Agents

| Framework | Status |
|-----------|--------|
| Claude Code | Supported |
| Cursor | Supported |
| Windsurf | Supported |
| Cline | Supported |
| Aider | Supported |
| GitHub Copilot | Supported |
| Devin | Supported |
| Replit Agent | Supported |

### LLM Providers

| Provider | Status |
|----------|--------|
| OpenAI | Supported |
| Anthropic | Supported |
| Google Gemini | Supported |
| Ollama | Supported |
| OpenRouter | Supported |
| Amazon Bedrock | Supported |
| Azure OpenAI | Supported |
| Groq | Supported |
| DeepSeek | Supported |
| Mistral | Supported |
| Perplexity | Supported |

### Agent Frameworks

| Framework | Status |
|-----------|--------|
| LangChain / LangGraph | Supported |
| CrewAI | Supported |
| OpenAI Agents SDK | Supported |
| LlamaIndex | Supported |
| Pydantic AI | Supported |
| Agno | Supported |
| Google ADK | Supported |
| Mastra | Supported |

### Automation

| Platform | Status |
|----------|--------|
| n8n | Supported |
| OpenClaw | Supported |

### Communication

| Platform | Status |
|----------|--------|
| Telegram | Supported |
| Discord | Supported |

## Protected by EYDII

ROAM ships with [EYDII](https://github.com/veritera-ai/eydii) embedded — the trust layer for autonomous systems. EYDII is content-blind and trustless: it never sees your agents' instructions, inputs, or outputs. It uses mathematical behavioral pattern analysis across three independent zones (sidecar, engine, proof) to determine whether an agent is acting within the rules you defined.

EYDII is non-optional. If you run ROAM, your agents are protected. There is nothing to configure and nothing to turn off.

## Repository Structure

This is the **public** repository containing the protocol specification, SDK, and documentation. The full engine source code is in a private repository and distributed as compiled packages via npm.

```
roam/
  protocol/       # Communication protocol specification
  sdk/            # TypeScript SDK for framework adapters
  docs/           # Documentation and integration guides
  examples/       # Usage examples and starter templates
  CHANGELOG.md    # Release history
```

## Links

| Resource | URL |
|----------|-----|
| EYDII Trust Layer | [github.com/veritera-ai/eydii](https://github.com/veritera-ai/eydii) |
| Veritera Corporation | [veritera.ai](https://veritera.ai) |
| npm Package | [@veritera.ai/roam](https://www.npmjs.com/package/@veritera.ai/roam) |
| Documentation | Coming soon |

## Patent Notice

ROAM incorporates technology covered by 7 patent applications filed by Veritera Corporation. The MIT license for the protocol and SDK does not grant rights under these patents for uses outside the scope of this software.

## License

The protocol specification, SDK, and documentation in this repository are licensed under the [MIT License](LICENSE).

The ROAM engine, desktop application, and behavioral intelligence components are proprietary software owned by Veritera Corporation. They are distributed as compiled packages via npm under a separate commercial license.

---

<p align="center">
  Built by <a href="https://veritera.ai">Veritera Engineering</a>
</p>
