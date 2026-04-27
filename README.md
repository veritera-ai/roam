<p align="center">
  <strong>Your AI agents can't talk to each other. ROAM fixes that.</strong>
</p>

<p align="center">
  Cross-framework orchestration for autonomous agents — local-first, zero cloud dependency.
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://www.npmjs.com/package/@veritera.ai/roam"><img src="https://img.shields.io/npm/v/@veritera.ai/roam.svg" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/frameworks-30-brightgreen" alt="30 Frameworks" />
  <img src="https://img.shields.io/badge/TypeScript-100%25-3178C6" alt="TypeScript" />
</p>

---

## The Problem

You have agents on Claude Code, n8n, LangChain, and CrewAI. They run on different runtimes, speak different protocols, and have no idea the others exist. When one drifts, the rest keep going. When you need them to coordinate, you end up duct-taping webhooks, polling shared databases, and writing custom glue code for every pair. You are the bottleneck in a system that was supposed to be autonomous.

**ROAM** (Republic of Autonomous Machines) is a cross-framework agent orchestration system. It gives every agent — regardless of framework — a shared communication layer, lifecycle management, and behavioral coordination. 14 packages, 52,667 lines of TypeScript, 30 frameworks, one protocol.

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

# Start orchestration
roam start
```

ROAM runs entirely on your machine. No cloud accounts, no API keys, no telemetry.

## What ROAM Does

### Cross-Framework Communication
Agents on different frameworks exchange structured messages through a shared file-based protocol. No custom integrations. No shared databases. Works with 30 frameworks out of the box.

### Lifecycle Management
Agents degrade over time — context windows fill, behavior drifts, outputs lose coherence. ROAM handles automated transitions: when an agent becomes unhealthy, the system swaps it out, preserves identity continuity, and the rest of the team never notices.

### Behavioral Coordination
Peer-based drift detection, not self-reporting. Agents observe each other. When behavior deviates from established patterns, the system surfaces it before the damage compounds.

### Trust Score
Every agent carries a Trust Score derived from behavioral pattern analysis. Healthy or unhealthy — measured continuously, not checked once at deployment.

### Desktop Application
Native desktop app built on Tauri v2. Full GUI for workspace management, agent monitoring, and real-time coordination. No browser required.

### 27 CLI Commands
Complete control from the terminal. Agent registration, workspace management, rule configuration, monitoring, transitions — everything the GUI does, the CLI does too.

## Architecture

ROAM is an 8-layer stack. This repository contains the protocol specification and SDK (layers L01-L03). The engine and runtime layers are proprietary.

```
+------------------------------------------------------------------+
|  L07  Desktop Application (Tauri v2)                             |
+------------------------------------------------------------------+
|  L06  CLI Interface (27 commands)                                |
+------------------------------------------------------------------+
|  L05  Orchestration Engine                                       |
+------------------------------------------------------------------+
|  L04  Behavioral Intelligence                                    |
+------------------------------------------------------------------+
|  L03  Rule Evaluation                                            |
+------------------------------------------------------------------+
|  L02  Framework Adapters (30 frameworks)                         |
+------------------------------------------------------------------+
|  L01  File-Based Communication Protocol                          |
+------------------------------------------------------------------+
|  EYDII  Trust Layer (content-blind, trustless, mathematical)     |
+------------------------------------------------------------------+
```

Layers L01-L03 are MIT-licensed and available in this repository. Layers L04-L07 are part of the proprietary engine distributed via npm.

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

### Automation and Orchestration

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
