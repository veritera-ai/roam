import type { AgentState, TaskState, HumanState } from "./types.js";

// Valid agent state transitions
const AGENT_TRANSITIONS: Record<AgentState, AgentState[]> = {
  ACTIVE: ["IDLE", "DRIFTING", "QUARANTINED"],
  IDLE: ["ACTIVE", "DRIFTING", "QUARANTINED", "ARCHIVED"],
  DRIFTING: ["TRANSITIONING", "QUARANTINED"],
  TRANSITIONING: ["REPLACED"],
  REPLACED: ["ARCHIVED"],
  ARCHIVED: [], // terminal
  QUARANTINED: ["ACTIVE", "ARCHIVED"], // recovery or retirement
};

// Valid task state transitions
const TASK_TRANSITIONS: Record<TaskState, TaskState[]> = {
  queued: ["claimed", "blocked", "abandoned"],
  claimed: ["in_progress", "queued", "abandoned"],
  in_progress: ["done", "failed", "blocked", "abandoned"],
  done: [], // terminal
  failed: ["queued"], // retry
  blocked: ["in_progress", "queued", "abandoned"],
  abandoned: [], // terminal
};

// Valid human state transitions — all states can reach all other states
const HUMAN_TRANSITIONS: Record<HumanState, HumanState[]> = {
  PRESENT: ["FOCUSED", "AWAY", "ON_DECK"],
  FOCUSED: ["PRESENT", "AWAY", "ON_DECK"],
  AWAY: ["PRESENT", "FOCUSED", "ON_DECK"],
  ON_DECK: ["PRESENT", "FOCUSED", "AWAY"],
};

export function isValidAgentTransition(
  from: AgentState,
  to: AgentState,
): boolean {
  return AGENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isValidTaskTransition(
  from: TaskState,
  to: TaskState,
): boolean {
  return TASK_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isValidHumanTransition(
  from: HumanState,
  to: HumanState,
): boolean {
  return HUMAN_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTerminalAgentState(state: AgentState): boolean {
  return AGENT_TRANSITIONS[state]?.length === 0;
}

export function isTerminalTaskState(state: TaskState): boolean {
  return TASK_TRANSITIONS[state]?.length === 0;
}

export function getValidAgentTransitions(state: AgentState): AgentState[] {
  return AGENT_TRANSITIONS[state] ?? [];
}

export function getValidTaskTransitions(state: TaskState): TaskState[] {
  return TASK_TRANSITIONS[state] ?? [];
}

export { AGENT_TRANSITIONS, TASK_TRANSITIONS, HUMAN_TRANSITIONS };
