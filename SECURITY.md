# Security

ROAM is a local-first operating layer for autonomous agent organizations, built by [Veritera Corporation](https://veritera.ai). It ships with EYDII, a content-blind trust layer for autonomous systems.

This public repository documents the security model and reporting process for evaluation. It does not expose protected ROAM engine internals, Steward coordination internals, EYDII behavioral intelligence internals, commercial packaging, or licensing systems.

---

## Reporting Vulnerabilities

Do not open a public GitHub issue for security vulnerabilities.

Send reports to:

```text
security@veritera.ai
```

Include:

- description of the vulnerability
- steps to reproduce
- affected component and version
- expected and actual behavior
- impact assessment, if known

We will acknowledge receipt within 48 hours and provide an initial assessment within 5 business days. Critical vulnerabilities affecting the content-blind boundary, local credential handling, file integrity, IPC, or agent isolation are treated as highest priority.

---

## Security Model

ROAM is designed around five security principles:

1. Local-first operation: the core daemon and workspace run on the operator's machine.
2. Content-blind trust: EYDII is designed to observe behavioral metadata rather than private agent content.
3. Local credential handling: agent credentials, tokens, and signing material belong on the local filesystem.
4. Explicit boundaries: public protocol and SDK surfaces are separated from protected commercial internals.
5. Operator control: telemetry and external integrations should be configurable and limited to what the operator enables.

---

## Content-Blind Boundary

EYDII is designed to monitor behavioral metadata:

- agent lifecycle state
- heartbeats
- task transitions
- peer drift reports
- trust and health events

EYDII is designed not to inspect private agent content:

- working documents
- messages
- artifacts
- private doctrine
- raw agent logs
- prompts and outputs

This boundary is the core trust claim. If you believe you have found a way for the observer to access forbidden content, report it privately.

---

## Architecture

EYDII operates across three independent zones: local interception, behavioral analysis, and mathematical proof. Each zone is designed to function independently — compromising one zone does not compromise the others.

---

## Data And Local Runtime

ROAM's core runtime is designed to run locally. The local workspace contains coordination state such as agent registrations, tasks, heartbeats, messages, memory, artifacts, and internal daemon state.

Do not publish `.roam/` directories, credentials, agent logs, private prompts, customer data, or generated work artifacts in public issues.

---

## Public vs Protected Components

Public components may include:

- protocol specification
- SDK surface
- documentation
- examples
- install and evaluation notes
- public security documentation

Protected components include:

- ROAM engine internals
- desktop application internals
- Steward coordination internals
- EYDII behavioral intelligence internals
- commercial packaging and licensing systems

For deeper enterprise, security, or investment review, contact Veritera for private architecture access under an appropriate agreement.

---

## Coordinated Disclosure

1. Report the issue privately to `security@veritera.ai`.
2. Veritera acknowledges receipt within 48 hours.
3. Veritera assesses severity and impact.
4. Veritera develops and verifies a fix or mitigation.
5. Public disclosure, if needed, happens after the fix is available.

We do not pursue legal action against security researchers who act in good faith, avoid privacy violations, avoid data destruction, and follow this process.
