<p align="center">
  <strong>ROAM</strong><br />
  <em>Republic of Autonomous Machines</em>
</p>

<p align="center">
  Run an organization of autonomous agents across the tools you already use.
</p>

<p align="center">
  <strong>Local-first.</strong> <strong>Heterogeneous.</strong> <strong>Zero token overhead.</strong> <strong>Protected by EYDII.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@veritera.ai/roam"><img src="https://img.shields.io/npm/v/@veritera.ai/roam.svg" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/runtime-local--first-111827" alt="Local-first runtime" />
  <img src="https://img.shields.io/badge/LLM_tokens-zero-0f766e" alt="Zero LLM token overhead" />
  <img src="https://img.shields.io/badge/license-proprietary-111827.svg" alt="Proprietary — Veritera Corporation" />
</p>

---

## ROAM Does Not Consume Your LLM Tokens

This is the first thing developers ask, so we put it first.

ROAM does not make LLM API calls. It does not proxy your model traffic. It does not inject a coordinator model between your agents. It does not add a "planner" or "orchestrator" that burns tokens to decide what to do next.

Your tokens go to the harnesses you chose — Claude Code, OpenAI, Cursor, Gemini, Ollama, whatever you run. ROAM never touches that traffic.

**How ROAM coordinates without tokens:**

```text
You type: roam task add "Research competitor pricing" --capability researcher

What happens:
  1. ROAM writes a task file to tasks/          → 0 tokens
  2. The daemon matches it to an agent           → 0 tokens (file-based routing)
  3. The agent's harness reads the task           → 0 tokens (local file read)
  4. The agent does the work                      → YOUR tokens, YOUR provider, YOUR keys
  5. The agent writes a completion to tasks/      → 0 tokens
  6. ROAM signs the transition and journals it    → 0 tokens (local Ed25519)
  7. EYDII observes the behavioral metadata       → 0 tokens (pattern matching, not LLM)
  8. The daemon routes the next task               → 0 tokens
```

Every agent framework that can read and write files can participate. That is the design. No wrapper. No proxy. No middleware model. No token tax.

The only tokens spent are the ones your agents spend doing real work, through the providers you already pay for.

---

## What ROAM Is (And Is Not)

We call ROAM an "operating system" for agent organizations. That word carries baggage, so here is what we mean and what we do not mean.

**ROAM is not:**
- A traditional OS (it does not manage hardware, processes, or kernel resources)
- An agent framework (it does not help you build agents — use LangChain, CrewAI, or whatever you prefer)
- An LLM wrapper (it never calls a model)
- A prompt router (it does not sit between your agent and its provider)
- Heavy infrastructure (it is a single Node.js daemon and a CLI)

**ROAM is:**
- A coordination layer — tasks, handoffs, routing, and scheduling across agents that run in different tools
- A memory layer — canon, journal, and shared knowledge that survives agent swaps and session restarts
- An identity layer — each agent has a signed registration, a token, and a verifiable history
- A trust layer — EYDII watches behavioral patterns for drift, not by reading your work, but by observing metadata

Think of it this way: if your agents are employees, ROAM is the office. The office does not do the employees' work. It gives them desks, a task board, a shared drive, nameplates, and a security system. The employees bring their own skills and tools.

The daemon is 12 MB. It runs on a Unix socket. It coordinates through local files. That is the entire footprint.

---

## Why It Exists

If you use more than one agent tool, you already know the failure mode.

Claude is in one window. Cursor is in another. GPT is somewhere else. n8n has its own workflow state. Local models have their own runtime. Each tool is useful. None of them know what the others are doing.

So you become the operating system.

You copy context between agents. You remember who owns which task. You notice when an agent drifts only after the work gets strange. You burn time re-explaining decisions. You become the router, memory, manager, auditor, and recovery system.

That does not scale.

ROAM gives the organization a local operating layer — without adding a token to your bill.

---

## What It Looks Like

Install and run `roam dashboard --watch` to see your agents in real time:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ ROAM Dashboard                                      3 agents · live │
├──────────────┬───────────┬──────────┬────────┬──────────────────────┤
│ Agent        │ Harness   │ Role     │ State  │ Trust Score          │
├──────────────┼───────────┼──────────┼────────┼──────────────────────┤
│ analyst      │ claude    │ research │ ACTIVE │ ████████░░ 82%       │
│ reviewer     │ openai    │ review   │ ACTIVE │ █████████░ 91%       │
│ builder      │ cursor    │ engineer │ IDLE   │ █████████░ 88%       │
├──────────────┴───────────┴──────────┴────────┴──────────────────────┤
│ Tasks: 2 in progress · 1 queued · 4 done                           │
│ EYDII: monitoring · 0 drift alerts · last sweep 34s ago            │
│ Daemon: PID 41823 · uptime 2h 14m · socket .roam/roam.sock        │
└─────────────────────────────────────────────────────────────────────┘
```

Three agents from three different tools — Claude Code, OpenAI, Cursor — coordinating through one local daemon. Each has a Trust Score. EYDII is running drift sweeps in the background. Zero tokens spent by ROAM.

---

## Quick Start

Requires Node.js 18+.

```bash
npm install -g @veritera.ai/roam
```

Create a workspace:

```bash
roam init my-project
cd my-project
roam
```

Register agents:

```bash
roam agent add analyst --framework claude-code --role research
roam agent add reviewer --framework openai --role review
roam agent add builder --framework cursor --role engineering
```

Start the daemon:

```bash
roam daemon start
roam status
roam dashboard --watch
```

Generate harness instructions (tells each agent how to talk to the daemon):

```bash
roam instructions claude-code
roam instructions openai
roam instructions cursor
```

If you are evaluating ROAM for a serious deployment, read [Security](SECURITY.md) before installing and contact Veritera for a deeper architecture review.

---

## What Runs Locally

ROAM is local-first infrastructure. The daemon, workspace state, memory, agent registry, task files, signatures, and coordination bus live on your machine.

```text
~/.roam/<project>/
  roam.yaml              # session configuration
  registry/              # signed agent registrations
  tasks/                 # task state machine
  messages/              # agent-to-agent messages
  heartbeats/            # liveness signals
  peer-reports/          # behavioral observations
  canon/                 # persistent role memory
  journal/               # append-only work history
  artifacts/             # shared deliverables
  doctrine/              # rules and operating documents
  .roam/
    roam.sock            # local IPC socket
    signing-key          # local signing key
    agent-tokens/        # per-agent identity tokens
```

Agents coordinate through files because every agent harness can read and write files. ROAM does not need each framework to expose the same API. The filesystem is the shared primitive. No network calls. No cloud dependency. No token spend.

---

## Protected By EYDII

Every other agent safety tool works the same way: it reads what your agent is doing and decides whether to allow it. That means the safety layer sees your code, your prompts, your data, your customers' data, everything. You are trusting the guard with the keys to the vault.

EYDII does not work that way.

EYDII is a trustless behavioral intelligence layer. It is embedded in ROAM, always on, and it monitors every agent in your organization without reading a single line of their work.

### How it works without reading your work

EYDII watches behavioral metadata: when an agent acts, what state it transitions to, how long between actions, whether it verified before completing, whether peers flagged it, whether it is drifting from its assigned role. These are structural signals — timing, cadence, state flow, peer reports — not content.

It never sees the prompt. It never sees the response. It never sees the code, the document, the artifact, the message. The boundary is architectural, not a policy toggle you can accidentally disable.

### What EYDII catches

Agents do not fail the way software fails. Software crashes. Agents drift. They keep running, keep producing output, but the output gradually stops matching the role they were trusted to perform. By the time you notice, the damage is in your shared memory, your artifacts, your deliverables.

EYDII detects these patterns before they spread:

- **Silent drift** — the agent is active but slowly moving outside its role boundaries
- **Phantom progress** — reporting completion without evidence of verification
- **Confidence-effort inversion** — becoming more assertive while doing less real work
- **Authorization creep** — taking actions beyond what the role permits
- **Cascade amplification** — one drifting agent's bad output corrupting others downstream
- **Stalled loops** — repeated attempts at the same task with no forward progress

Each pattern is detected from behavioral metadata alone. No LLM call. No content inspection. No token cost.

### Trust Score

Every agent in your ROAM organization carries a Trust Score. It is not a one-time grade — it is a live signal derived from EYDII's behavioral analysis: operating cadence, verification patterns, peer reports, role adherence, and health over time.

When an agent drifts and recovers, the score reflects it. When an agent keeps degrading, the score reflects that too. When a role is swapped to a fresh agent, the Trust Score history stays attached to the role so the standard does not reset with the model.

You decide the threshold. EYDII gives you the signal. You keep the authority.

### Why this matters

If you are running one agent in one tool, you can watch it yourself. If you are running five agents across Claude Code, Cursor, ChatGPT, and n8n, you cannot watch all of them. And the failure mode of an unwatched agent is not a crash — it is quiet degradation that looks like progress until the work is already shared.

EYDII exists because behavioral trust is a different problem from access control, content filtering, or prompt injection defense. Those layers protect the perimeter. EYDII watches what happens after the agent is already inside, already trusted, already working — and tells you when that trust should be reconsidered.

No other coordination system ships with this. ROAM does.

| EYDII observes | EYDII never reads |
| --- | --- |
| heartbeat timing and cadence | agent working documents |
| lifecycle state transitions | prompts or responses |
| task claim, completion, failure patterns | source code or artifacts |
| peer-to-peer drift reports | messages between agents |
| verification gaps and role deviation | private doctrine or files |

Zero tokens. Zero content inspection. Trustless behavioral intelligence from metadata alone.

Learn more: [EYDII on GitHub](https://github.com/veritera-ai/eydii)

---

## Start Here

- [SDK surface](sdk/README.md)
- [Security](SECURITY.md)
- [Support](SUPPORT.md)

---

## Links

| Resource | Link |
| --- | --- |
| ROAM | https://github.com/veritera-ai/roam |
| EYDII trust layer | https://github.com/veritera-ai/eydii |
| Veritera | https://veritera.ai |
| npm package | https://www.npmjs.com/package/@veritera.ai/roam |

---

<p align="center">
  <strong>ROAM</strong> runs the organization.<br />
  <strong>EYDII</strong> watches for drift.<br />
  <strong>Your tokens</strong> stay yours.
</p>
