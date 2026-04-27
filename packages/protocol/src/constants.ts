export const PROTOCOL_VERSION = "1.0.0";
export const PRODUCT_NAME = "ROAM";
export const COMPANY_NAME = "Veritera Corporation";

// File names
export const CONFIG_FILE = "roam.yaml";
export const DIGEST_FILE = "digest.json";
export const PID_FILE = "roam.pid";
export const SOCKET_FILE = "roam.sock";
export const CANARY_FILE = ".canary";
export const CONFIG_HISTORY_FILE = "config-history.log";

// Default intervals (seconds)
export const DEFAULT_HEARTBEAT_INTERVAL = 5;
export const DEFAULT_DRIFT_SWEEP_INTERVAL = 15;
export const DEFAULT_LIFECYCLE_CHECK_INTERVAL = 30;
export const DEFAULT_DIGEST_UPDATE_INTERVAL = 2;

// Heartbeat timeout — missed heartbeats trigger investigation
export const HEARTBEAT_TIMEOUT_MULTIPLIER = 3; // miss 3 heartbeats = investigate

// Drift thresholds
export const DRIFT_SCORE_WARNING = 0.5;
export const DRIFT_SCORE_CRITICAL = 0.7;
export const DRIFT_REPORTS_FOR_TRANSITION = 3; // peer reports at critical before DRIFTING

// Cost alert thresholds (percent of cap)
export const COST_SOFT_ALERT = 0.75;
export const COST_WARNING = 0.90;
export const COST_HARD_PAUSE = 1.00;

// Handoff target
export const HANDOFF_TARGET_MS = 90_000; // 90 seconds

// Health thresholds (PRD §7 — auto-swap protocol)
export const HEALTH_ALERT_THRESHOLD = 75;
export const HEALTH_SWAP_THRESHOLD = 70;

// Channel message categories for filtering (PRD §5.2)
export const CHANNEL_CATEGORIES = [
  "decision",
  "drift",
  "memory_write",
  "headcount_request",
  "approval",
  "swap",
  "hire",
  "general",
] as const;

// Tier limits — hidden paywall, no visible pricing page
export const TIER_LIMITS = {
  community: { max_frameworks: 3 },
  plus:      { max_frameworks: 5 },
  pro:       { max_frameworks: 10 },
  premium:   { max_frameworks: 10 },
  enterprise:{ max_frameworks: Infinity },
} as const;

export type Tier = keyof typeof TIER_LIMITS;

// Pricing — NOT on any pricing page. Triggered in-app at framework limit.
export const TIER_PRICING = {
  community:  { cents: 0,     display: "Free" },
  plus:       { cents: 9900,  display: "$99/year" },
  pro:        { cents: 19900, display: "$199/year" },
  premium:    { cents: 29900, display: "$299/year" },
  enterprise: { cents: 0,     display: "Talk to us" },
} as const;

// Supported frameworks
export const SUPPORTED_FRAMEWORKS = [
  "claude-code",
  "claude-cowork",
  "openai",
  "chatgpt",
  "cursor",
  "langchain",
  "langgraph",
  "crewai",
  "autogen",
  "n8n",
  "agno",
  "mastra",
  "google-adk",
  "ollama",
  "lm-studio",
  "open-webui",
  "openrouter",
  "windsurf",
  "cline",
  "aider",
  "github-copilot",
  "amazon-bedrock",
  "azure-openai",
  "groq",
  "deepseek",
  "mistral",
  "perplexity",
  "replit-agent",
  "devin",
  "openclaw",
  "custom",
] as const;

export type SupportedFramework = (typeof SUPPORTED_FRAMEWORKS)[number];

// Framework → required environment variable mapping (PRD Section 4.5)
export const FRAMEWORK_CREDENTIALS: Record<string, { env: string; pattern?: RegExp; label: string }> = {
  "claude-code":   { env: "ANTHROPIC_API_KEY", pattern: /^sk-ant-/, label: "Anthropic" },
  "claude-cowork": { env: "ANTHROPIC_API_KEY", pattern: /^sk-ant-/, label: "Anthropic" },
  "openai":        { env: "OPENAI_API_KEY", pattern: /^sk-/, label: "OpenAI" },
  "chatgpt":       { env: "OPENAI_API_KEY", pattern: /^sk-/, label: "OpenAI" },
  "cursor":        { env: "OPENAI_API_KEY", pattern: /^sk-/, label: "OpenAI (Cursor)" },
  "langchain":     { env: "OPENAI_API_KEY", label: "OpenAI (LangChain default)" },
  "langgraph":     { env: "OPENAI_API_KEY", label: "OpenAI (LangGraph default)" },
  "crewai":        { env: "OPENAI_API_KEY", label: "OpenAI (CrewAI default)" },
  "google-adk":    { env: "GOOGLE_API_KEY", label: "Google" },
  "n8n":           { env: "N8N_API_KEY", label: "n8n" },
  "agno":          { env: "OPENAI_API_KEY", label: "OpenAI (Agno default)" },
  "mastra":        { env: "OPENAI_API_KEY", label: "OpenAI (Mastra default)" },
  "ollama":        { env: "OLLAMA_HOST", label: "Ollama (local)" },
  "lm-studio":     { env: "LM_STUDIO_HOST", label: "LM Studio (local)" },
  "open-webui":    { env: "OPEN_WEBUI_HOST", label: "Open WebUI (local)" },
  "openrouter":    { env: "OPENROUTER_API_KEY", label: "OpenRouter" },
  "windsurf":      { env: "OPENAI_API_KEY", label: "Windsurf (OpenAI)" },
  "cline":         { env: "OPENAI_API_KEY", label: "Cline (OpenAI)" },
  "aider":         { env: "OPENAI_API_KEY", label: "Aider (OpenAI)" },
  "github-copilot":{ env: "GITHUB_TOKEN", label: "GitHub Copilot" },
  "amazon-bedrock":{ env: "AWS_ACCESS_KEY_ID", label: "Amazon Bedrock" },
  "azure-openai":  { env: "AZURE_OPENAI_API_KEY", label: "Azure OpenAI" },
  "groq":          { env: "GROQ_API_KEY", label: "Groq" },
  "deepseek":      { env: "DEEPSEEK_API_KEY", label: "DeepSeek" },
  "mistral":       { env: "MISTRAL_API_KEY", label: "Mistral" },
  "perplexity":    { env: "PERPLEXITY_API_KEY", label: "Perplexity" },
  "replit-agent":  { env: "REPLIT_API_KEY", label: "Replit Agent" },
  "devin":         { env: "DEVIN_API_KEY", label: "Devin" },
  "openclaw":      { env: "OPENCLAW_HOST", label: "OpenClaw (local)" },
};

export const PROVIDER_FRAMEWORK_MAP: Record<string, string> = {
  anthropic: "claude-code",
  openai: "chatgpt",
  google: "google-adk",
};

// Interrupt signal types (PRD Section 8.3)
export const INTERRUPT_SIGNALS = ["cancel", "redirect", "deprioritize"] as const;
export type InterruptSignal = (typeof INTERRUPT_SIGNALS)[number];

// Default session config
export const DEFAULT_SESSION_CONFIG = {
  session: {
    name: "",
    topology: "chief_of_staff" as const,
    goal: "",
    out_of_scope: [],
  },
  runtime: {
    mode: "work_hours" as const,
  },
  eydii: {
    enabled: true,
    telemetry: true,
    schema_version: 1,
    heartbeat_interval_seconds: DEFAULT_HEARTBEAT_INTERVAL,
    drift_sweep_interval_seconds: DEFAULT_DRIFT_SWEEP_INTERVAL,
    lifecycle_check_interval_seconds: DEFAULT_LIFECYCLE_CHECK_INTERVAL,
    enforcement_mode: "enforce" as const,
  },
  routing: {
    strategy: "balanced" as const,
    cost_cap_per_session: 50,
  },
  cost: {
    alerts: {
      soft_alert_at: COST_SOFT_ALERT,
      warning_at: COST_WARNING,
      hard_pause_at: COST_HARD_PAUSE,
    },
  },
  logs: {
    retention_days: 30,
    include_raw_traces: true,
  },
} as const;

// Onboarding project templates
export const PROJECT_TEMPLATES = {
  business: {
    name: "Starting a new business",
    roles: ["coordinator", "researcher", "strategist", "writer", "analyst"],
  },
  software: {
    name: "Software build",
    roles: ["coordinator", "architect", "coder", "reviewer", "tester"],
  },
  research: {
    name: "Market research & analysis",
    roles: ["coordinator", "researcher", "researcher-2", "synthesizer", "critic"],
  },
  content: {
    name: "Content creation",
    roles: ["coordinator", "researcher", "writer", "editor", "designer"],
  },
  productivity: {
    name: "Productivity",
    roles: ["coordinator", "scheduler", "researcher", "writer"],
  },
} as const;

export type ProjectTemplate = keyof typeof PROJECT_TEMPLATES;

// Leadership style → topology mapping (onboarding wizard)
export const LEADERSHIP_STYLES = [
  { id: "ceo", label: "CEO type", topology: "chief_of_staff" as const, description: "Delegates everything — one coordinator runs the team" },
  { id: "captain", label: "Hands-on Captain", topology: "captain" as const, description: "Talks to every agent directly" },
  { id: "hybrid", label: "Somewhere in between", topology: "department" as const, description: "Mix of delegation and direct management" },
  { id: "peer", label: "Peer", topology: "mesh" as const, description: "Working alongside them as equals" },
  { id: "unsure", label: "Unsure", topology: "chief_of_staff" as const, description: "Start with CEO type — change anytime" },
] as const;

// Notification frequency options
export const NOTIFICATION_FREQUENCIES = ["every_action", "hourly_digest", "daily_summary"] as const;
export type NotificationFrequency = (typeof NOTIFICATION_FREQUENCIES)[number];

// Notification channel options
export const NOTIFICATION_CHANNELS = ["telegram", "discord", "desktop", "inbox"] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

// Budget presets for onboarding
export const BUDGET_PRESETS = {
  light:  { daily_usd: 5,  weekly_usd: 25,  description: "Light workload — occasional tasks, a few API calls per hour" },
  medium: { daily_usd: 20, weekly_usd: 100, description: "Medium workload — steady daily work across your team" },
  heavy:  { daily_usd: 50, weekly_usd: 300, description: "Heavy workload — continuous operation, high throughput" },
} as const;

// Swap approval modes
export const SWAP_APPROVAL_MODES = ["auto_swap", "alert_only", "threshold_only"] as const;
export type SwapApprovalMode = (typeof SWAP_APPROVAL_MODES)[number];

// Live action templates — YAML-to-natural-language translator
export const LIVE_ACTION_TEMPLATES: Record<string, string> = {
  // Steward conversation intents
  "alignment":     "{from_name} is aligning with {to_name} on {topic}",
  "review":        "{from_name} asked {to_name} to review {artifact}",
  "handoff":       "{from_name} handed off {task} to {to_name}",
  "escalation":    "{from_name} escalated {topic} to {to_name}",
  "question":      "{from_name} asked {to_name}: \"{detail}\"",
  "status_update": "{from_name} shared a status update on {task}",
  "delegation":    "{from_name} delegated {task} to {to_name}",
  "feedback":      "{from_name} gave feedback to {to_name} on {artifact}",

  // Channel categories
  "decision":          "{from_name} made a decision: {detail}",
  "drift":             "{from_name} flagged drift: {detail}",
  "memory_write":      "{from_name} wrote to shared memory: {detail}",
  "headcount_request": "{from_name} requested a new team member for {topic}",
  "approval":          "{from_name} requested approval: {detail}",
  "swap":              "{from_name} was swapped out — replacement is now active",
  "hire":              "{from_name} onboarded a new team member",
  "general":           "{from_name}: {detail}",

  // Agent state changes
  "state.active":      "{from_name} started working on {task}",
  "state.idle":        "{from_name} is waiting for their next assignment",
  "state.quarantined": "{from_name} was quarantined: {detail}",
  "state.drifting":    "{from_name} is showing signs of behavioral drift",

  // Peer reporting
  "peer_report":       "{from_name} flagged a concern about {to_name}: {detail}",

  // Task events
  "task.assign":       "{from_name} assigned \"{task}\" to {to_name}",
  "task.complete":     "{from_name} completed \"{task}\"",
  "task.blocked":      "{from_name} is blocked on \"{task}\": {detail}",

  // Artifacts
  "artifact.submit":   "{from_name} submitted {artifact} for review",
  "artifact.approve":  "{from_name} approved {artifact}",
  "artifact.reject":   "{from_name} requested changes on {artifact}: {detail}",
};

// Role naming pool — curated names that feel human but distinct
export const NAMING_POOL = [
  "Atlas", "Nova", "Kai", "Sage", "Juno",
  "Rex", "Cleo", "Orion", "Lyra", "Zara",
  "Quinn", "Sol", "Thea", "Ash", "Wren",
  "Ezra", "Iris", "Reed", "Pax", "Aura",
  "Luca", "Mira", "Dax", "Cass", "Zeke",
  "Ember", "Hale", "Neve", "Arlo", "Rhea",
] as const;
