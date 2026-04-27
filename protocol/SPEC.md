# ROAM Protocol Overview

ROAM coordinates autonomous agents through a local filesystem protocol.

The design goal is harness independence: any agent or runtime that can read and write files can participate in the same republic.

## Core Idea

Each republic has a local workspace:

```text
~/.roam/<republic>/
  registry/
  tasks/
  messages/
  heartbeats/
  peer-reports/
  canon/
  journal/
  artifacts/
  doctrine/
  .roam/
```

Agents do not need to call each other through model APIs. They coordinate by writing structured files that ROAM can validate, route, observe, and turn into a live operational view.

## Public Evaluation Fields

This public spec focuses on the integration surface:

- how an agent registers
- how tasks are represented
- how heartbeats are emitted
- how messages are written
- how peer drift reports are filed
- how persistent memory is organized

Protected engine internals, Steward enforcement internals, and EYDII behavioral intelligence internals are not part of this public spec.

## Agent Registration

An agent registration describes who the agent is, what harness it uses, and what role it serves.

```yaml
agent_id: analyst
name: Analyst
framework: claude-code
role: research
capabilities:
  research: 0.9
  synthesis: 0.7
```

## Task

Tasks are structured work items.

```yaml
task_id: task-001
title: Compare competitor pricing
state: queued
capability: research
assigned_to: null
created_at: "2026-04-26T14:30:00Z"
```

## Heartbeat

Heartbeats let ROAM know whether an agent is alive and active.

```json
{
  "agent_id": "analyst",
  "state": "active",
  "current_task": "task-001",
  "timestamp": "2026-04-26T14:35:00Z"
}
```

## Message

Messages are asynchronous coordination artifacts.

```yaml
from: analyst
to: reviewer
intent: handoff
task_id: task-001
body: Research complete. Please review the pricing summary.
timestamp: "2026-04-26T15:10:00Z"
```

## Peer Report

Peer reports are behavioral observations, not content inspection.

```yaml
reporter_id: reviewer
subject_id: analyst
signal_type: output_quality_drop
severity: 0.6
evidence: Missed assigned scope in recent task status.
timestamp: "2026-04-26T15:20:00Z"
```

## Content-Blind Boundary

ROAM separates content directories from behavioral metadata.

EYDII is designed to observe behavioral metadata such as state, heartbeats, task transitions, and peer reports while avoiding agent content such as working documents, messages, artifacts, private doctrine, and raw logs.

Read [Security](../SECURITY.md) for the current threat model and reporting process.
