import type { NotificationFrequency, NotificationChannel, SwapApprovalMode } from "./constants.js";

// Project type — set during onboarding wizard
export type ProjectType = "business" | "software" | "research" | "content" | "productivity" | "custom";

// NotificationFrequency, NotificationChannel, and SwapApprovalMode are
// derived from const arrays in constants.ts — single source of truth.

// Agent lifecycle states
export type AgentState =
  | "ACTIVE"
  | "IDLE"
  | "DRIFTING"
  | "TRANSITIONING"
  | "REPLACED"
  | "ARCHIVED"
  | "QUARANTINED";

export type QuarantineReason =
  | "rate_limit"
  | "provider_outage"
  | "billing_failure"
  | "auth_failure"
  | "cost_cap"
  | "heartbeat_timeout"
  | "drift_threshold"
  | "unknown";

// Human lifecycle states — never overlap with agent states
export type HumanState = "PRESENT" | "FOCUSED" | "AWAY" | "ON_DECK";

export type ParticipationMode = "observer" | "advisor" | "participant";

// Task lifecycle states
export type TaskState =
  | "queued"
  | "claimed"
  | "in_progress"
  | "done"
  | "failed"
  | "blocked"
  | "abandoned";

export type BlockReason = "on_human" | "on_dependency" | "on_quarantine";

// Routing
export type RoutingStrategy =
  | "balanced"
  | "cost_optimized"
  | "latency_optimized"
  | "quality_optimized";

// Topology — set during onboarding
export type Topology =
  | "chief_of_staff"
  | "captain"
  | "mesh"
  | "sprint"
  | "department";

// Agent framework type
export type AgentType = "hosted_api" | "local_model" | "custom";

// Runtime mode
export type RuntimeMode = "continuous" | "work_hours";

// Enforcement mode — internal intent pipeline behavior
export type EnforcementMode = "monitor" | "alert" | "enforce";

// Framework verification result
export interface FrameworkVerifyResult {
  framework: string;
  reachable: boolean;
  latency_ms?: number;
  error?: string;
  checked_at: string;
}

// --- Session Config (roam.yaml) ---

export interface SessionConfig {
  session: {
    name: string;
    topology: Topology;
    goal: string;
    out_of_scope: string[];
  };
  runtime: {
    mode: RuntimeMode;
  };
  eydii: {
    enabled: boolean;
    telemetry: boolean;
    schema_version: number;
    heartbeat_interval_seconds: number;
    drift_sweep_interval_seconds: number;
    lifecycle_check_interval_seconds: number;
    quarantine_auto?: boolean;
    enforcement_mode: EnforcementMode;
  };
  routing: {
    strategy: RoutingStrategy;
    cost_cap_per_session: number;
  };
  cost: {
    alerts: {
      soft_alert_at: number;
      warning_at: number;
      hard_pause_at: number;
    };
  };
  logs: {
    retention_days: number;
    include_raw_traces: boolean;
  };
  budget?: {
    daily_cap_usd: number;
    weekly_cap_usd: number;
  };
  output?: {
    directory: string;
  };
  notifications?: {
    frequency: NotificationFrequency;
    channels: NotificationChannel[];
  };
  approval?: {
    action_autonomous: boolean;
    swap_mode: SwapApprovalMode;
    health_threshold: number;
  };
}

// --- Role Metadata (roles/{role-slug}/role_metadata.yaml) ---

export interface RoleMetadata {
  role_slug: string;
  display_name: string;
  title: string;
  created_at: string;
  current_agent_id: string | null;
  agent_history: RoleAgentHistoryEntry[];
}

export interface RoleAgentHistoryEntry {
  agent_id: string;
  started_at: string;
  ended_at: string | null;
  exit_reason: "swapped" | "archived" | "quarantined" | null;
}

// --- Canon Memory Layer ---

export type CanonEntryType = "fact" | "decision" | "judgment" | "mandate" | "in_flight";

export type CanonEntryStatus = "active" | "quarantined" | "invalidated";

export interface CanonEntry {
  id: string;
  type: CanonEntryType;
  content: string;
  source_agent_id: string;
  source_role_slug: string;
  created_at: string;
  drift_score_at_write: number;
  status: CanonEntryStatus;
  quarantined_at?: string;
  quarantine_reason?: string;
  tags?: string[];
}

export interface JournalEntry {
  timestamp: string;
  agent_id: string;
  role_slug: string;
  summary: string;
  decisions_made: string[];
  open_questions: string[];
  drift_score: number;
}

export interface SharedArchiveEntry {
  id: string;
  topic: string;
  content: string;
  contributed_by: string[];
  created_at: string;
  updated_at: string;
  status: CanonEntryStatus;
}

// Invalidation events that trigger scoped canon review
export type InvalidationEvent =
  | "agent_swap"
  | "human_swap"
  | "mandate_shift"
  | "drift_detected"
  | "pivot";

// Which entry types get invalidated by which events
export const INVALIDATION_MATRIX: Record<InvalidationEvent, CanonEntryType[]> = {
  agent_swap:    ["in_flight", "judgment"],
  human_swap:    ["mandate"],
  mandate_shift: ["mandate", "judgment", "in_flight"],
  drift_detected:["judgment", "in_flight"],
  pivot:         ["fact", "decision", "judgment", "mandate", "in_flight"],
};

// --- Intent/Verdict Protocol (Zone 1 desktop prevention) ---

export type IntentVerdict = "APPROVED" | "BLOCKED";

export interface IntentRequest {
  intent_id: string;
  agent_id: string;
  action_type: string;
  action_target: string;
  action_metadata?: Record<string, unknown>;
  submitted_at: string;
}

export interface VerdictResponse {
  intent_id: string;
  verdict: IntentVerdict;
  reason?: string;
  rule_id?: string;
  evaluated_at: string;
}

export interface AgentGate {
  agent_id: string;
  status: "OPEN" | "BLOCKED";
  blocked_at?: string;
  blocked_reason?: string;
  health_score_at_block?: number;
}

// --- Agent Registration (registry/{agent-id}.yaml) ---

export interface AgentRegistration {
  agent_id: string;
  name: string;
  framework: string;
  agent_type: AgentType;
  role: string;
  role_slug?: string;
  capabilities: Record<string, number>; // capability → weight 0.0-1.0
  primary_provider?: string;
  fallback_provider?: string;
  fallback_triggers?: string[];
  cost_tier?: "low" | "medium" | "high";
  registered_at: string; // ISO 8601
  state: AgentState;
}

// --- Human Registration (registry/{human-id}.yaml) ---

export interface HumanRegistration {
  human_id: string;
  name: string;
  role: string;
  capabilities: Record<string, number>;
  response_sla: {
    default: string; // e.g. "4h"
    critical: string; // e.g. "1h"
  };
  state: HumanState;
  participation_mode: ParticipationMode;
  registered_at: string;
}

// --- Task Interrupt ---

export type InterruptType = "cancel" | "redirect" | "deprioritize";

export interface TaskInterrupt {
  type: InterruptType;
  issued_at: string;
  issued_by: string;
  redirect_to?: string;
  acknowledged_at?: string;
}

// --- Task Definition (tasks/{task-id}.yaml) ---

export interface TaskDefinition {
  task_id: string;
  description: string;
  capability: string;
  state: TaskState;
  block_reason?: BlockReason;
  priority: "low" | "normal" | "high" | "critical";
  depends_on: string[]; // task IDs
  assigned_to?: string; // agent or human ID
  claimed_at?: string;
  completed_at?: string;
  created_at: string;
  created_by: string; // "founder" or agent ID
  routing_strategy?: RoutingStrategy;
  assessment?: TaskAssessment;
  interrupt?: TaskInterrupt;
}

export interface TaskAssessment {
  subtasks: number;
  sequence: string[];
  dependencies: string[];
  estimated_compute_cycles: number;
  estimated_token_budget: number;
  blocking_factors: string[];
  confidence: "low" | "medium" | "high";
}

// --- Heartbeat Record (heartbeats/{agent-id}.json) ---

export interface HeartbeatRecord {
  agent_id: string;
  timestamp_utc: string;
  state: AgentState;
  current_task?: string;
  token_count?: number;
  memory_mb?: number;
}

// --- Peer Report (peer-reports/{reporter-id}/{subject-id}/{timestamp}.yaml) ---

export interface PeerReport {
  reporter_id: string;
  subject_id: string;
  signal_type:
    | "quality_degradation"
    | "response_latency"
    | "instruction_deviation"
    | "repetition"
    | "coherence_loss"
    | "capability_mismatch";
  severity: number; // 0.0-1.0
  evidence: string;
  timestamp_utc: string;
}

// --- Agent State File (state/{agent-id}.yaml) ---

export interface AgentStateRecord {
  agent_id: string;
  state: AgentState;
  previous_state?: AgentState;
  transitioned_at: string;
  quarantine_reason?: QuarantineReason;
  quarantine_details?: {
    error_code?: string;
    provider?: string;
    reset_at?: string;
    retry_count?: number;
  };
}

// --- Human State File (state/{human-id}.yaml) ---

export interface HumanStateRecord {
  human_id: string;
  state: HumanState;
  previous_state?: HumanState;
  transitioned_at: string;
  expected_return?: string;
}

// --- Four Artifacts (per agent working directory) ---

export interface DecisionEntry {
  timestamp: string;
  decision: string;
  reasoning: string;
  alternatives_rejected?: string[];
}

export interface OpenQuestion {
  id: string;
  question: string;
  for: string; // "founder" | agent ID
  priority: "low" | "normal" | "high";
  created_at: string;
}

export interface StateOfWork {
  task_id: string;
  status: string;
  progress_summary: string;
  next_steps: string[];
  blocked_on?: string;
  updated_at: string;
}

// --- Cost Records (cost/) ---

export interface CostRecord {
  agent_id: string;
  task_id?: string;
  framework: string;
  action_type: string;
  token_count?: number;
  cost_usd: number;
  timestamp_utc: string;
}

export interface CostSummary {
  session_total_usd: number;
  cap_usd: number;
  percent_used: number;
  per_agent: Record<string, number>;
  per_task: Record<string, number>;
  projection_cap_hit_at?: string;
}

// --- Message (messages/{recipient-id}/{timestamp}.yaml) ---

export interface AgentMessage {
  from: string;
  to: string;
  content: string;
  priority: "normal" | "urgent";
  timestamp_utc: string;
  in_reply_to?: string;
}

// --- Live Message (real-time feed) ---

export interface LiveMessage {
  id: string;
  type: "conversation" | "channel" | "status_change" | "system" | "peer_report";
  from_name: string;
  from_role: string;
  from_framework: string;
  content: string;
  timestamp_utc: string;
  agent_id?: string;
  conversation_id?: string;
  to_name?: string;
  severity?: number;
}

// --- Live Status Update (agent presence) ---

export interface LiveStatusUpdate {
  agent_id: string;
  name: string;
  role: string;
  framework: string;
  status: "working" | "idle";
  current_task?: string;
  idle_since?: string;
}

// --- EYDII Action-Result Telemetry ---

export type ActionType =
  | "task_claim"
  | "task_complete"
  | "task_fail"
  | "heartbeat"
  | "drift_report"
  | "lifecycle_transition"
  | "routing_decision"
  | "quarantine_enter"
  | "quarantine_exit";

export interface ActionResult {
  action_id: string;
  session_id: string; // hashed
  agent_id: string; // hashed
  action_type: ActionType;
  capability_tag?: string;
  timestamp_utc: string;
  latency_ms?: number;
  outcome: "success" | "failure" | "partial" | "timeout";
  error_category?: string;
  retry_count?: number;
  routing_strategy?: RoutingStrategy;
  // NEVER present: prompt, payload, output content, agent reasoning
}

// --- Session Digest (.roam/digest.json) ---

export interface SessionDigest {
  session_name: string;
  topology: Topology;
  agent_count: number;
  agents_active: number;
  agents_quarantined: number;
  agents_drifting: number;
  agents_swapped_total: number;
  tasks_completed: number;
  tasks_in_progress: number;
  tasks_queued: number;
  tasks_blocked: number;
  throughput_24h: number;
  drift_caught_total: number;
  memory_writes_hour: number;
  cost_summary: CostSummary;
  last_activity_utc: string;
  waiting_on_human: WaitingItem[];
  recent_events: DigestEvent[];
  runtime_status: "running" | "paused" | "stopped";
  updated_at: string;
}

export interface WaitingItem {
  agent_id: string;
  question: string;
  tasks_blocked: number;
  waiting_since: string;
}

export interface DigestEvent {
  type: string;
  summary: string;
  timestamp_utc: string;
}

// --- Routing Decision ---

export interface RoutingDecision {
  task_id: string;
  selected_agent: string;
  strategy: RoutingStrategy;
  scores: Record<string, AgentScore>;
  narration: string;
  decided_at: string;
}

export interface AgentScore {
  agent_id: string;
  total: number;
  dimensions: {
    capability: number;
    load: number;
    track_record: number;
    cost: number;
    latency: number;
    dependencies: number;
    affinity: number;
    drift_awareness: number;
  };
}

// --- Config History (.roam/config-history.log entries) ---

export interface ConfigChange {
  timestamp_utc: string;
  field: string;
  from: string;
  to: string;
  reason?: string;
}

// --- IPC Messages (daemon <-> CLI) ---

export interface IPCRequest {
  id: string;
  method: string;
  params?: unknown;
}

export interface IPCResponse {
  id: string;
  result?: unknown;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface IPCNotification {
  id: null;
  event: string;
  data: unknown;
}

// --- Job Description (versioned, hashed, signed against — PRD §1.3) ---

export interface JobDescriptionVersion {
  version: number;
  hash: string; // SHA-256 of content
  content: string;
  authored_by: string; // "owner" or agent_id
  created_at: string;
  active: boolean;
}

// --- Persona Status (dashboard-facing, mapped from AgentState) ---
// ACTIVE → working (has task) or idle (no task). PRD §6.1 specifies all six.

export type PersonaStatus =
  | "working"
  | "waiting"
  | "idle"
  | "drifting"
  | "quarantined"
  | "derelict";

// --- Persona Profile (the 7-field model — PRD §3) ---
// Aggregated view for the dashboard. Not stored as one file —
// composed from role metadata, JD versions, skills, health, audit.

export interface PersonaProfile {
  role_code: string; // permanent seat identifier e.g. "[COS]", "[BE01]"
  role_slug: string;
  name: string; // persona display name
  title: string; // e.g. "Chief of Staff", "Backend Engineer"
  harness: string; // framework the persona lives on
  current_agent_id: string | null;
  agent_history: RoleAgentHistoryEntry[];
  job_description: JobDescriptionVersion | null; // active version
  jd_version_count: number;
  skills: SkillAssignment[];
  health: number; // 0-100
  health_sparkline: number[]; // 60 datapoints, oldest first, rolling 60-min
  status: PersonaStatus;
  joined_at: string;
  last_activity_at: string | null;
  current_task?: string;
  eta?: string;
  canon_entry_count: number;
}

// --- Skill Assignment (per-persona, discovered from harness — PRD §1.4) ---
// ROAM never creates or hosts skills. Discovery and assignment only.

export interface SkillAssignment {
  skill_id: string;
  name: string;
  source_harness: string;
  type: "tool" | "function" | "plugin" | "extension" | "unknown";
  discovered_at: string;
  assigned_at: string;
  assigned_by: string; // "owner" or "onboarding"
  revoked_at?: string;
  revocation_signed?: boolean;
}

// --- Channel Messages (PRD §5.2) ---

export type ChannelKind = "escalation" | "ambient";

export type ChannelCategory =
  | "decision"
  | "drift"
  | "memory_write"
  | "headcount_request"
  | "approval"
  | "swap"
  | "hire"
  | "general";

export interface ChannelMessage {
  id: string;
  kind: ChannelKind;
  category: ChannelCategory;
  from_role_slug: string;
  from_name: string;
  from_title: string;
  content: string; // human-language sentence
  requires_action: boolean;
  action_id?: string; // links to a DecisionItem
  timestamp_utc: string;
}

// --- Decisions (owner action queue — PRD §5.1) ---

export type DecisionType =
  | "approval"
  | "headcount_request"
  | "canon_publish"
  | "jd_edit_confirm"
  | "import_override"
  | "swap_approval";

export interface DecisionItem {
  id: string;
  type: DecisionType;
  from_role_slug: string;
  from_name: string;
  proposal: string; // human sentence — what the persona is proposing
  detail?: string;
  actions: DecisionAction[];
  created_at: string;
  resolved_at?: string;
  resolution?: string; // chosen action id
}

export interface DecisionAction {
  id: string;
  label: string; // e.g. "Approve", "Discuss", "Pause"
  verb: "approve" | "discuss" | "pause";
}

// --- Headcount Request (PRD §6.3) ---

export interface HeadcountRequest {
  id: string;
  requested_by_role: string;
  requested_by_name: string;
  proposed_role_code: string;
  proposed_title: string;
  proposed_name?: string;
  justification: string;
  suggested_jd: string;
  suggested_harness?: string;
  estimated_workload_impact: string;
  status: "pending" | "approved" | "rejected" | "archived";
  decision_id: string; // links to DecisionItem
  created_at: string;
  resolved_at?: string;
  rejection_reason?: string;
}

// --- Today Briefing (PRD §5.1) ---

export interface TodayBriefing {
  summary_line: string; // e.g. "Laura has been running things for 14h 22m."
  stats: {
    tasks_shipped: number;
    tasks_in_flight: number;
    tasks_needing_owner: number;
    personas_drifting: number;
  };
  last_action: {
    persona_name: string;
    persona_title: string;
    ago_text: string; // e.g. "12s ago"
    timestamp_utc: string;
  } | null;
  decisions_waiting: DecisionItem[];
  shipped_today: ShippedItem[];
  running_now: RunningItem[];
  is_empty: boolean; // true = "all clear" win-state
  empty_message?: string; // e.g. "All clear. Laura has nothing for you."
}

export interface ShippedItem {
  description: string;
  persona_name: string;
  completed_at: string;
  time_display: string; // e.g. "09:14"
}

export interface RunningItem {
  description: string;
  persona_name: string;
  eta_text: string; // e.g. "ETA 18m"
}

// --- EYDII Band (PRD §4.1) ---

export interface EydiiBandStatus {
  personas_observed: number;
  actions_signed_today: number;
  last_alert: {
    summary: string; // e.g. "Diego auto-swapped"
    timestamp_utc: string;
    time_display: string; // e.g. "02:14"
  } | null;
  status: "healthy" | "alert" | "critical";
}

// --- Doctor's Visit (Grayfield import screening — PRD §5.4) ---

export type ScreeningCheckStatus = "pass" | "fail" | "warning";

export interface ScreeningCheck {
  name: string; // e.g. "Behavior baseline established"
  status: ScreeningCheckStatus;
  detail: string; // e.g. "124 historical actions analyzed"
}

export interface HealthCheckResult {
  import_id: string;
  source_harness: string;
  source_session_name: string;
  checks: ScreeningCheck[];
  recommendation: string; // human sentence
  lane_mismatch?: {
    detected_work: string; // e.g. "70% copywriting, 30% legal research"
    assigned_role: string;
  };
  overall_status: "clear" | "warning" | "block";
  created_at: string;
}

/** @deprecated Use HealthCheckResult */
export type DoctorVisitResult = HealthCheckResult;

// --- Onboarding Config (wizard output — full session bootstrap) ---

export interface OnboardingConfig {
  project_type: ProjectType;
  leadership_style: string;
  topology: string;
  frameworks: string[];
  credentials: Record<string, string>;
  team_names: string[];
  team_roles: string[];
  team_jds: string[];
  team_frameworks: string[];
  adoption_results?: unknown[];
  skills_imported?: string[];
  budget: { daily_cap_usd: number; weekly_cap_usd: number };
  output_directory: string;
  approval: { action_autonomous: boolean; swap_mode: SwapApprovalMode; health_threshold: number };
  telegram: { enabled: boolean | "later"; token?: string; chat_id?: string };
  runtime_mode: string;
  notification_frequency: NotificationFrequency;
  notification_channels: NotificationChannel[];
}

// --- Team Proposal (onboarding wizard — PRD §5.5) ---

export interface TeamProposal {
  project_description: string;
  topology: Topology;
  proposed_personas: ProposedPersona[];
  naming_source: "roam" | "owner";
  created_at: string;
}

export interface ProposedPersona {
  role_code: string;
  suggested_name: string;
  suggested_title: string;
  suggested_jd: string;
  suggested_harness: string;
  suggested_skills: string[];
  accepted: boolean | null; // null = not yet decided
}

// --- Health Configuration (PRD §7) ---

export interface HealthThresholdConfig {
  alert_threshold: number; // default 75
  swap_threshold: number; // default 70
  auto_swap_enabled: boolean;
}

// --- License ---

export interface RoamLicense {
  tier: "community" | "plus" | "pro" | "premium" | "enterprise";
  email?: string;
  stripe_customer_id?: string;
  max_frameworks: number;
  valid_until?: string;
  issued_at: string;
}
