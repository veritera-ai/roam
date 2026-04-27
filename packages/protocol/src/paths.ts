import { join } from "path";

export function sessionPaths(root: string) {
  return {
    root,
    config: join(root, "roam.yaml"),
    readme: join(root, "README.md"),

    // Directories
    agents: join(root, "agents"),
    registry: join(root, "registry"),
    tasks: join(root, "tasks"),
    messages: join(root, "messages"),
    state: join(root, "state"),
    heartbeats: join(root, "heartbeats"),
    artifacts: join(root, "artifacts"),
    doctrine: join(root, "doctrine"),
    peerReports: join(root, "peer-reports"),
    agentLogs: join(root, "agent-logs"),
    cost: join(root, "cost"),
    conversations: join(root, "conversations"),

    // Internal
    internal: join(root, ".roam"),
    socket: join(root, ".roam", "roam.sock"),
    pid: join(root, ".roam", "roam.pid"),
    digest: join(root, ".roam", "digest.json"),
    configHistory: join(root, ".roam", "config-history.log"),
    observerQueue: join(root, ".roam", "observer-queue"),
    canary: join(root, "agents", ".canary"),
    receipts: join(root, ".roam", "receipts"),
    intents: join(root, ".roam", "intents"),
    verdicts: join(root, ".roam", "verdicts"),
    gates: join(root, ".roam", "gates"),
    denials: join(root, ".roam", "denials"),
    attestations: join(root, ".roam", "attestations"),
    audit: join(root, ".roam", "audit"),
    notifications: join(root, ".roam", "notifications"),
    lockout: join(root, ".roam", "lockout"),
    policies: join(root, ".roam", "policies"),
    security: join(root, ".roam", "security"),
  };
}

export function rolePaths(root: string, roleSlug: string) {
  const base = join(root, "roles", roleSlug);
  return {
    base,
    metadata: join(base, "role_metadata.yaml"),
    journal: join(base, "journal.jsonl"),
    canon: join(base, "canon.json"),
    jdVersions: join(base, "jd-versions.json"),
    skills: join(base, "skills.json"),
  };
}

export function sharedArchivePath(root: string) {
  return join(root, "roles", "_shared", "archive.json");
}

export function agentPaths(root: string, agentId: string) {
  const base = join(root, "agents", agentId);
  return {
    base,
    workingDoctrine: join(base, "working-doctrine.md"),
    decisionLog: join(base, "decision-log.md"),
    openQuestions: join(base, "open-questions.md"),
    stateOfWork: join(base, "state-of-work.md"),
  };
}

export function registryPath(root: string, entityId: string) {
  return join(root, "registry", `${entityId}.yaml`);
}

export function taskPath(root: string, taskId: string) {
  return join(root, "tasks", `${taskId}.yaml`);
}

export function statePath(root: string, entityId: string) {
  return join(root, "state", `${entityId}.yaml`);
}

export function heartbeatPath(root: string, agentId: string) {
  return join(root, "heartbeats", `${agentId}.json`);
}

export function messagePath(
  root: string,
  recipientId: string,
  timestamp: string,
) {
  return join(root, "messages", recipientId, `${timestamp}.yaml`);
}

export function peerReportPath(
  root: string,
  reporterId: string,
  subjectId: string,
  timestamp: string,
) {
  return join(
    root,
    "peer-reports",
    reporterId,
    subjectId,
    `${timestamp}.yaml`,
  );
}

export function costRecordPath(root: string, filename: string) {
  return join(root, "cost", filename);
}

export function agentLogPath(root: string, agentId: string, taskId: string) {
  return join(root, "agent-logs", agentId, `${taskId}.log`);
}

export function conversationPaths(root: string, conversationId: string) {
  const base = join(root, "messages", "conversations", conversationId);
  return {
    base,
    meta: join(base, "meta.yaml"),
    messagesDir: join(base, "messages"),
  };
}

export function conversationMessagePath(
  root: string,
  conversationId: string,
  sequence: number,
) {
  const seq = String(sequence).padStart(4, "0");
  return join(
    root,
    "messages",
    "conversations",
    conversationId,
    "messages",
    `${seq}.yaml`,
  );
}

export function agentInboxPath(root: string, agentId: string) {
  return join(root, "messages", "inbox", agentId);
}

export function channelPath(root: string) {
  return join(root, ".roam", "channel.jsonl");
}

export function decisionsPath(root: string) {
  return join(root, ".roam", "decisions.json");
}

export function headcountRequestsPath(root: string) {
  return join(root, ".roam", "headcount-requests.json");
}

// All directories that must exist in a session
export const SESSION_DIRS = [
  "agents",
  "registry",
  "roles",
  "tasks",
  "messages",
  "state",
  "heartbeats",
  "artifacts",
  "doctrine",
  "peer-reports",
  "agent-logs",
  "cost",
  "conversations",
  ".roam",
  ".roam/observer-queue",
  ".roam/receipts",
  ".roam/denials",
  ".roam/attestations",
  ".roam/audit",
  ".roam/notifications",
  ".roam/lockout",
  ".roam/policies",
] as const;

// Directories the EYDII observer can read (content-blind boundary)
export const OBSERVER_READABLE_DIRS = [
  "state",
  "heartbeats",
  "tasks",
  "peer-reports",
] as const;

// Directories the EYDII observer must NOT read (content)
export const OBSERVER_FORBIDDEN_DIRS = [
  "agents",
  "messages",
  "artifacts",
  "doctrine",
  "agent-logs",
] as const;
