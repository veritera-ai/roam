import { writeFileSync, readFileSync, readdirSync, existsSync, renameSync, unlinkSync } from "fs";
import { join } from "path";
import { stringify, parse } from "yaml";
import { atomicWrite, nowUtc, ensureDir } from "@roam/core";

/**
 * Acquire an exclusive lock file. Returns true if lock was obtained.
 * Uses O_CREAT | O_EXCL (wx flag) so only one process can create it.
 */
function acquireLock(lockPath: string): boolean {
  try {
    writeFileSync(lockPath, String(process.pid), { flag: "wx" });
    return true;
  } catch {
    return false;
  }
}

function releaseLock(lockPath: string): void {
  try {
    unlinkSync(lockPath);
  } catch {
    // Lock file already removed — benign
  }
}

/**
 * Execute a read-modify-write on a task file under an exclusive file lock.
 * Throws if the lock cannot be acquired (another agent is modifying this task).
 */
function withTaskLock<T>(filePath: string, fn: () => T): T {
  const lockPath = `${filePath}.lock`;
  if (!acquireLock(lockPath)) {
    throw new Error(`Task file is locked by another process: ${filePath}`);
  }
  try {
    return fn();
  } finally {
    releaseLock(lockPath);
  }
}
import {
  type AgentRegistration,
  type AgentState,
  type HeartbeatRecord,
  type TaskDefinition,
  type PeerReport,
  type AgentMessage,
  type DecisionEntry,
  type OpenQuestion,
  type StateOfWork,
  agentPaths,
  registryPath,
  taskPath,
  heartbeatPath,
  statePath,
  messagePath,
  peerReportPath,
} from "@roam/protocol";

export interface RoamAgentConfig {
  sessionDir: string;
  agentId: string;
  name: string;
  framework: string;
  role: string;
  capabilities?: Record<string, number>;
  agentType?: AgentRegistration["agent_type"];
}

export class RoamAgent {
  private config: RoamAgentConfig;
  private paths: ReturnType<typeof agentPaths>;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config: RoamAgentConfig) {
    this.config = config;
    this.paths = agentPaths(config.sessionDir, config.agentId);
  }

  // --- Lifecycle ---

  register(): void {
    const reg: AgentRegistration = {
      agent_id: this.config.agentId,
      name: this.config.name,
      framework: this.config.framework,
      agent_type: this.config.agentType ?? "hosted_api",
      role: this.config.role,
      capabilities: this.config.capabilities ?? {},
      registered_at: nowUtc(),
      state: "IDLE",
    };

    atomicWrite(
      registryPath(this.config.sessionDir, this.config.agentId),
      stringify(reg),
    );

    ensureDir(this.paths.base);

    this.writeState("IDLE");
  }

  heartbeat(extra?: { current_task?: string; token_count?: number; memory_mb?: number }): void {
    const record: HeartbeatRecord = {
      agent_id: this.config.agentId,
      timestamp_utc: nowUtc(),
      state: "ACTIVE",
      ...extra,
    };

    atomicWrite(
      heartbeatPath(this.config.sessionDir, this.config.agentId),
      JSON.stringify(record, null, 2),
    );
  }

  startHeartbeatLoop(intervalMs: number = 5000): void {
    this.heartbeat();
    this.heartbeatTimer = setInterval(() => this.heartbeat(), intervalMs);
  }

  stopHeartbeatLoop(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  transitionTo(state: AgentState): void {
    this.writeState(state);
  }

  // --- Tasks ---

  claimTask(taskId: string): void {
    const path = taskPath(this.config.sessionDir, taskId);
    withTaskLock(path, () => {
      const raw = readFileSync(path, "utf-8");
      const task = parse(raw) as TaskDefinition;

      task.state = "claimed";
      task.assigned_to = this.config.agentId;
      task.claimed_at = nowUtc();

      atomicWrite(path, stringify(task));
    });
  }

  startTask(taskId: string): void {
    const path = taskPath(this.config.sessionDir, taskId);
    withTaskLock(path, () => {
      const raw = readFileSync(path, "utf-8");
      const task = parse(raw) as TaskDefinition;

      task.state = "in_progress";
      atomicWrite(path, stringify(task));
    });
  }

  completeTask(taskId: string): void {
    const path = taskPath(this.config.sessionDir, taskId);
    withTaskLock(path, () => {
      const raw = readFileSync(path, "utf-8");
      const task = parse(raw) as TaskDefinition;

      task.state = "done";
      task.completed_at = nowUtc();
      atomicWrite(path, stringify(task));
    });
  }

  failTask(taskId: string): void {
    const path = taskPath(this.config.sessionDir, taskId);
    withTaskLock(path, () => {
      const raw = readFileSync(path, "utf-8");
      const task = parse(raw) as TaskDefinition;

      task.state = "failed";
      task.completed_at = nowUtc();
      atomicWrite(path, stringify(task));
    });
  }

  // --- Peer Reporting (never self-report) ---

  reportPeer(subjectId: string, report: Omit<PeerReport, "reporter_id" | "subject_id" | "timestamp_utc">): void {
    if (subjectId === this.config.agentId) {
      throw new Error("Agents cannot self-report drift. Peer reporting only.");
    }

    const full: PeerReport = {
      reporter_id: this.config.agentId,
      subject_id: subjectId,
      ...report,
      timestamp_utc: nowUtc(),
    };

    const ts = Date.now().toString();
    atomicWrite(
      peerReportPath(this.config.sessionDir, this.config.agentId, subjectId, ts),
      stringify(full),
    );
  }

  // --- Four-Artifact Protocol ---

  updateWorkingDoctrine(content: string): void {
    atomicWrite(this.paths.workingDoctrine, content);
  }

  updateDecisionLog(entry: DecisionEntry): void {
    let existing = "";
    try {
      existing = readFileSync(this.paths.decisionLog, "utf-8");
    } catch { /* new file */ }

    const line = `## ${entry.timestamp}\n\n**Decision:** ${entry.decision}\n**Reasoning:** ${entry.reasoning}\n`;
    const rejected = entry.alternatives_rejected?.length
      ? `**Rejected:** ${entry.alternatives_rejected.join(", ")}\n`
      : "";

    atomicWrite(this.paths.decisionLog, existing + line + rejected + "\n---\n\n");
  }

  updateOpenQuestions(questions: OpenQuestion[]): void {
    const content = questions
      .map((q) => `- [${q.priority}] ${q.question} (for: ${q.for})`)
      .join("\n");
    atomicWrite(this.paths.openQuestions, `# Open Questions\n\n${content}\n`);
  }

  updateStateOfWork(state: StateOfWork): void {
    atomicWrite(this.paths.stateOfWork, stringify(state));
  }

  // --- Messages ---

  sendMessage(recipientId: string, content: string, priority: "normal" | "urgent" = "normal"): void {
    const msg: AgentMessage = {
      from: this.config.agentId,
      to: recipientId,
      content,
      priority,
      timestamp_utc: nowUtc(),
    };

    const ts = Date.now().toString();
    atomicWrite(
      messagePath(this.config.sessionDir, recipientId, ts),
      stringify(msg),
    );
  }

  readMessages(): AgentMessage[] {
    const dir = join(this.config.sessionDir, "messages", this.config.agentId);
    if (!existsSync(dir)) return [];

    return readdirSync(dir)
      .filter((f) => f.endsWith(".yaml"))
      .sort()
      .map((f) => {
        const raw = readFileSync(join(dir, f), "utf-8");
        return parse(raw) as AgentMessage;
      });
  }

  // PRD Section 8.3: Poll for interrupt signals
  checkInterrupts(): Array<{ task_id: string; signal: string; payload: string | null; issued_at: string }> {
    const dir = join(this.config.sessionDir, ".roam", "interrupts");
    if (!existsSync(dir)) return [];

    return readdirSync(dir)
      .filter((f) => f.endsWith(".yaml"))
      .map((f) => {
        const raw = readFileSync(join(dir, f), "utf-8");
        return parse(raw) as { task_id: string; signal: string; payload: string | null; issued_at: string };
      })
      .filter((s) => {
        // Only return signals for tasks this agent is working on
        const taskDir = join(this.config.sessionDir, "tasks");
        if (!existsSync(taskDir)) return false;
        const taskFiles = readdirSync(taskDir).filter((f) => f.endsWith(".yaml"));
        for (const tf of taskFiles) {
          const task = parse(readFileSync(join(taskDir, tf), "utf-8")) as TaskDefinition;
          if (task.task_id === s.task_id && task.assigned_to === this.config.agentId) return true;
        }
        return false;
      });
  }

  // Acknowledge and remove an interrupt signal
  acknowledgeInterrupt(taskId: string, signal: string): void {
    const dir = join(this.config.sessionDir, ".roam", "interrupts");
    const filename = `${taskId}_${signal}.yaml`;
    const filepath = join(dir, filename);
    if (existsSync(filepath)) {
      renameSync(filepath, filepath + ".ack");
    }
  }

  // --- Internal ---

  private writeState(state: AgentState): void {
    atomicWrite(
      statePath(this.config.sessionDir, this.config.agentId),
      stringify({
        agent_id: this.config.agentId,
        state,
        transitioned_at: nowUtc(),
      }),
    );
  }
}
