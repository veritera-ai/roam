import { z } from "zod";

// --- Enums ---

export const AgentStateSchema = z.enum([
  "ACTIVE", "IDLE", "DRIFTING", "TRANSITIONING", "REPLACED", "ARCHIVED", "QUARANTINED",
]);

export const QuarantineReasonSchema = z.enum([
  "rate_limit", "provider_outage", "billing_failure", "auth_failure", "cost_cap", "heartbeat_timeout", "drift_threshold", "unknown",
]);

export const HumanStateSchema = z.enum(["PRESENT", "FOCUSED", "AWAY", "ON_DECK"]);

export const ParticipationModeSchema = z.enum(["observer", "advisor", "participant"]);

export const TaskStateSchema = z.enum([
  "queued", "claimed", "in_progress", "done", "failed", "blocked", "abandoned",
]);

export const BlockReasonSchema = z.enum(["on_human", "on_dependency", "on_quarantine"]);

export const RoutingStrategySchema = z.enum([
  "balanced", "cost_optimized", "latency_optimized", "quality_optimized",
]);

export const TopologySchema = z.enum([
  "chief_of_staff", "captain", "mesh", "sprint", "department",
]);

export const AgentTypeSchema = z.enum(["hosted_api", "local_model", "custom"]);

export const RuntimeModeSchema = z.enum(["continuous", "work_hours"]);

export const PrioritySchema = z.enum(["low", "normal", "high", "critical"]);

export const ConfidenceSchema = z.enum(["low", "medium", "high"]);

export const ActionTypeSchema = z.enum([
  "task_claim", "task_complete", "task_fail", "heartbeat",
  "drift_report", "lifecycle_transition", "routing_decision",
  "quarantine_enter", "quarantine_exit",
]);

export const OutcomeSchema = z.enum(["success", "failure", "partial", "timeout"]);

export const TierSchema = z.enum(["community", "plus", "pro", "premium", "enterprise"]);

export const EnforcementModeSchema = z.enum(["monitor", "alert", "enforce"]);


// --- Session Config (roam.yaml) ---

export const SessionConfigSchema = z.object({
  session: z.object({
    name: z.string().min(1),
    topology: TopologySchema.default("chief_of_staff"),
    goal: z.string().default(""),
    out_of_scope: z.array(z.string()).default([]),
  }),
  runtime: z.object({
    mode: RuntimeModeSchema.default("work_hours"),
  }).default({}),
  eydii: z.object({
    enabled: z.boolean().default(true),
    telemetry: z.boolean().default(true),
    schema_version: z.number().int().positive().default(1),
    heartbeat_interval_seconds: z.number().positive().default(30),
    drift_sweep_interval_seconds: z.number().positive().default(60),
    lifecycle_check_interval_seconds: z.number().positive().default(30),
    quarantine_auto: z.boolean().default(true),
    enforcement_mode: EnforcementModeSchema.default("enforce"),
  }).default({}),
  routing: z.object({
    strategy: RoutingStrategySchema.default("balanced"),
    cost_cap_per_session: z.number().nonnegative().default(50),
  }).default({}),
  cost: z.object({
    alerts: z.object({
      soft_alert_at: z.number().min(0).max(1).default(0.75),
      warning_at: z.number().min(0).max(1).default(0.90),
      hard_pause_at: z.number().min(0).max(1).default(1.00),
    }).default({}),
  }).default({}),
  logs: z.object({
    retention_days: z.number().int().positive().default(30),
    include_raw_traces: z.boolean().default(true),
  }).default({}),
});

export const SafeIdSchema = z.string().min(1).max(64).regex(
  /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/,
  "IDs must be alphanumeric (with hyphens/underscores), no path separators",
);

// --- Canon Memory Layer ---

export const CanonEntryTypeSchema = z.enum(["fact", "decision", "judgment", "mandate", "in_flight"]);
export const CanonEntryStatusSchema = z.enum(["active", "quarantined", "invalidated"]);

export const CanonEntrySchema = z.object({
  id: z.string().min(1),
  type: CanonEntryTypeSchema,
  content: z.string().min(1),
  source_agent_id: SafeIdSchema,
  source_role_slug: SafeIdSchema,
  created_at: z.string().datetime(),
  drift_score_at_write: z.number().min(0).max(1),
  status: CanonEntryStatusSchema,
  quarantined_at: z.string().datetime().optional(),
  quarantine_reason: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const JournalEntrySchema = z.object({
  timestamp: z.string().datetime(),
  agent_id: SafeIdSchema,
  role_slug: SafeIdSchema,
  summary: z.string().min(1),
  decisions_made: z.array(z.string()),
  open_questions: z.array(z.string()),
  drift_score: z.number().min(0).max(1),
});

export const SharedArchiveEntrySchema = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  content: z.string().min(1),
  contributed_by: z.array(SafeIdSchema),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  status: CanonEntryStatusSchema,
});

// --- Role Metadata ---

export const RoleAgentHistoryEntrySchema = z.object({
  agent_id: SafeIdSchema,
  started_at: z.string().datetime(),
  ended_at: z.string().datetime().nullable(),
  exit_reason: z.enum(["swapped", "archived", "quarantined"]).nullable(),
});

export const RoleMetadataSchema = z.object({
  role_slug: SafeIdSchema,
  display_name: z.string().min(1),
  title: z.string().min(1),
  created_at: z.string().datetime(),
  current_agent_id: SafeIdSchema.nullable(),
  agent_history: z.array(RoleAgentHistoryEntrySchema),
});

// --- Agent Registration ---

export const AgentRegistrationSchema = z.object({
  agent_id: SafeIdSchema,
  name: z.string().min(1),
  framework: z.string().min(1),
  agent_type: AgentTypeSchema,
  role: z.string().min(1),
  role_slug: SafeIdSchema.optional(),
  capabilities: z.record(z.string(), z.number().min(0).max(1)),
  primary_provider: z.string().optional(),
  fallback_provider: z.string().optional(),
  fallback_triggers: z.array(z.string()).optional(),
  cost_tier: z.enum(["low", "medium", "high"]).optional(),
  registered_at: z.string().datetime(),
  state: AgentStateSchema,
});

// --- Human Registration ---

export const HumanRegistrationSchema = z.object({
  human_id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  capabilities: z.record(z.string(), z.number().min(0).max(1)),
  response_sla: z.object({
    default: z.string(),
    critical: z.string(),
  }),
  state: HumanStateSchema,
  participation_mode: ParticipationModeSchema,
  registered_at: z.string().datetime(),
});

// --- Task Interrupt ---

export const InterruptTypeSchema = z.enum(["cancel", "redirect", "deprioritize"]);

export const TaskInterruptSchema = z.object({
  type: InterruptTypeSchema,
  issued_at: z.string().datetime(),
  issued_by: z.string().min(1),
  redirect_to: z.string().optional(),
  acknowledged_at: z.string().datetime().optional(),
});

// --- Task ---

export const TaskAssessmentSchema = z.object({
  subtasks: z.number().int().nonnegative(),
  sequence: z.array(z.string()),
  dependencies: z.array(z.string()),
  estimated_compute_cycles: z.number().nonnegative(),
  estimated_token_budget: z.number().nonnegative(),
  blocking_factors: z.array(z.string()),
  confidence: ConfidenceSchema,
});

export const TaskDefinitionSchema = z.object({
  task_id: z.string().min(1),
  description: z.string().min(1),
  capability: z.string().min(1),
  state: TaskStateSchema,
  block_reason: BlockReasonSchema.optional(),
  priority: PrioritySchema,
  depends_on: z.array(z.string()),
  assigned_to: z.string().optional(),
  claimed_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  created_by: z.string().min(1),
  routing_strategy: RoutingStrategySchema.optional(),
  assessment: TaskAssessmentSchema.optional(),
  interrupt: TaskInterruptSchema.optional(),
});

// --- Heartbeat ---

export const HeartbeatRecordSchema = z.object({
  agent_id: z.string().min(1),
  timestamp_utc: z.string().datetime(),
  state: AgentStateSchema,
  current_task: z.string().optional(),
  token_count: z.number().nonnegative().optional(),
  memory_mb: z.number().nonnegative().optional(),
});

// --- Peer Report ---

export const PeerReportSchema = z.object({
  reporter_id: z.string().min(1),
  subject_id: z.string().min(1),
  signal_type: z.enum([
    "quality_degradation", "response_latency", "instruction_deviation",
    "repetition", "coherence_loss", "capability_mismatch",
  ]),
  severity: z.number().min(0).max(1),
  evidence: z.string(),
  timestamp_utc: z.string().datetime(),
});

// --- State Records ---

export const AgentStateRecordSchema = z.object({
  agent_id: z.string().min(1),
  state: AgentStateSchema,
  previous_state: AgentStateSchema.optional(),
  transitioned_at: z.string().datetime(),
  quarantine_reason: QuarantineReasonSchema.optional(),
  quarantine_details: z.object({
    error_code: z.string().optional(),
    provider: z.string().optional(),
    reset_at: z.string().optional(),
    retry_count: z.number().int().nonnegative().optional(),
  }).optional(),
});

export const HumanStateRecordSchema = z.object({
  human_id: z.string().min(1),
  state: HumanStateSchema,
  previous_state: HumanStateSchema.optional(),
  transitioned_at: z.string().datetime(),
  expected_return: z.string().optional(),
});

// --- Cost ---

export const CostRecordSchema = z.object({
  agent_id: z.string().min(1),
  task_id: z.string().optional(),
  framework: z.string().min(1),
  action_type: z.string().min(1),
  token_count: z.number().nonnegative().optional(),
  cost_usd: z.number().nonnegative(),
  timestamp_utc: z.string().datetime(),
});

// --- Message ---

export const AgentMessageSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  content: z.string(),
  priority: z.enum(["normal", "urgent"]),
  timestamp_utc: z.string().datetime(),
  in_reply_to: z.string().optional(),
});

// --- EYDII Action Result ---

export const ActionResultSchema = z.object({
  action_id: z.string().min(1),
  session_id: z.string().min(1),
  agent_id: z.string().min(1),
  action_type: ActionTypeSchema,
  capability_tag: z.string().optional(),
  timestamp_utc: z.string().datetime(),
  latency_ms: z.number().nonnegative().optional(),
  outcome: OutcomeSchema,
  error_category: z.string().optional(),
  retry_count: z.number().int().nonnegative().optional(),
  routing_strategy: RoutingStrategySchema.optional(),
});

// --- Job Description Version (PRD §1.3) ---

export const JobDescriptionVersionSchema = z.object({
  version: z.number().int().positive(),
  hash: z.string().min(1),
  content: z.string().min(1),
  authored_by: z.string().min(1),
  created_at: z.string().datetime(),
  active: z.boolean(),
});

// --- Skill Assignment (PRD §1.4) ---

export const SkillAssignmentSchema = z.object({
  skill_id: z.string().min(1),
  name: z.string().min(1),
  source_harness: z.string().min(1),
  type: z.enum(["tool", "function", "plugin", "extension", "unknown"]),
  discovered_at: z.string().datetime(),
  assigned_at: z.string().datetime(),
  assigned_by: z.string().min(1),
  revoked_at: z.string().datetime().optional(),
  revocation_signed: z.boolean().optional(),
});

// --- Channel Message (PRD §5.2) ---

export const ChannelKindSchema = z.enum(["escalation", "ambient"]);

export const ChannelCategorySchema = z.enum([
  "decision", "drift", "memory_write", "headcount_request",
  "approval", "swap", "hire", "general",
]);

export const ChannelMessageSchema = z.object({
  id: z.string().min(1),
  kind: ChannelKindSchema,
  category: ChannelCategorySchema,
  from_role_slug: z.string().min(1),
  from_name: z.string().min(1),
  from_title: z.string().min(1),
  content: z.string().min(1),
  requires_action: z.boolean(),
  action_id: z.string().optional(),
  timestamp_utc: z.string().datetime(),
});

// --- Decision Item (PRD §5.1) ---

export const DecisionTypeSchema = z.enum([
  "approval", "headcount_request", "canon_publish",
  "jd_edit_confirm", "import_override", "swap_approval",
]);

export const DecisionActionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  verb: z.enum(["approve", "discuss", "pause"]),
});

export const DecisionItemSchema = z.object({
  id: z.string().min(1),
  type: DecisionTypeSchema,
  from_role_slug: z.string().min(1),
  from_name: z.string().min(1),
  proposal: z.string().min(1),
  detail: z.string().optional(),
  actions: z.array(DecisionActionSchema),
  created_at: z.string().datetime(),
  resolved_at: z.string().datetime().optional(),
  resolution: z.string().optional(),
});

// --- Headcount Request (PRD §6.3) ---

export const HeadcountRequestSchema = z.object({
  id: z.string().min(1),
  requested_by_role: z.string().min(1),
  requested_by_name: z.string().min(1),
  proposed_role_code: z.string().min(1),
  proposed_title: z.string().min(1),
  proposed_name: z.string().optional(),
  justification: z.string().min(1),
  suggested_jd: z.string().min(1),
  suggested_harness: z.string().optional(),
  estimated_workload_impact: z.string().min(1),
  status: z.enum(["pending", "approved", "rejected", "archived"]),
  decision_id: z.string().min(1),
  created_at: z.string().datetime(),
  resolved_at: z.string().datetime().optional(),
  rejection_reason: z.string().optional(),
});

// --- Doctor's Visit (PRD §5.4) ---

export const ScreeningCheckStatusSchema = z.enum(["pass", "fail", "warning"]);

export const ScreeningCheckSchema = z.object({
  name: z.string().min(1),
  status: ScreeningCheckStatusSchema,
  detail: z.string().min(1),
});

export const DoctorVisitResultSchema = z.object({
  import_id: z.string().min(1),
  source_harness: z.string().min(1),
  source_session_name: z.string().min(1),
  checks: z.array(ScreeningCheckSchema),
  recommendation: z.string().min(1),
  lane_mismatch: z.object({
    detected_work: z.string().min(1),
    assigned_role: z.string().min(1),
  }).optional(),
  overall_status: z.enum(["clear", "warning", "block"]),
  created_at: z.string().datetime(),
});

// --- Team Proposal (PRD §5.5) ---

export const ProposedPersonaSchema = z.object({
  role_code: z.string().min(1),
  suggested_name: z.string().min(1),
  suggested_title: z.string().min(1),
  suggested_jd: z.string().min(1),
  suggested_harness: z.string().min(1),
  suggested_skills: z.array(z.string()),
  accepted: z.boolean().nullable(),
});

export const TeamProposalSchema = z.object({
  project_description: z.string().min(1),
  topology: TopologySchema,
  proposed_personas: z.array(ProposedPersonaSchema),
  naming_source: z.enum(["roam", "owner"]),
  created_at: z.string().datetime(),
});

// --- Health Configuration (PRD §7) ---

export const HealthThresholdConfigSchema = z.object({
  alert_threshold: z.number().min(0).max(100).default(75),
  swap_threshold: z.number().min(0).max(100).default(70),
  auto_swap_enabled: z.boolean().default(true),
});

// --- License ---

export const RoamLicenseSchema = z.object({
  tier: TierSchema,
  email: z.string().email().optional(),
  stripe_customer_id: z.string().optional(),
  max_frameworks: z.number().int().positive(),
  valid_until: z.string().datetime().optional(),
  issued_at: z.string().datetime(),
});

// --- IPC ---

export const IPCRequestSchema = z.object({
  id: z.string().min(1),
  method: z.string().min(1),
  params: z.unknown().optional(),
});

export const IPCResponseSchema = z.object({
  id: z.string().min(1),
  result: z.unknown().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }).optional(),
});
