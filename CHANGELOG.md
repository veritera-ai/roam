# Changelog

All notable changes to ROAM will be documented in this file.

## [0.2.1] - 2026-04-26

### Added
- Discord notification channel with rich embeds and 8 `/roam` commands
- ROAM Live — real-time agent communication feed with zero-LLM translation
- 13-step onboarding wizard (CLI + GUI)
- OpenClaw support as framework #30
- Framework signatures for all 30 supported harnesses
- Peer drift reporting visibility in live feed
- Idle agent detection with steward nudge (15-minute threshold)
- Notification frequency gating (every action / hourly digest / daily summary)

### Changed
- "Doctor visit" renamed to "health check" across all surfaces
- Expanded framework support from 17 to 30 frameworks
- GUI onboarding redesigned from 6 steps to 13 steps

## [0.2.0] - 2026-04-20

### Added
- Steward governance kernel with constitutional compliance
- Control Room GUI — 14 views, Stripe-quality dashboard
- Drift engine with EWMA behavioral scoring
- Cost engine with per-framework API usage tracking
- Auto-swap protocol with configurable thresholds
- Telegram notification bot
- Agent canon (facts, decisions, judgments)
- File-based YAML channels for inter-agent communication

## [0.1.0] - 2026-04-10

### Added
- Initial daemon with IPC protocol
- Agent lifecycle management
- Task queue with priority scheduling
- Basic CLI with 12 commands
