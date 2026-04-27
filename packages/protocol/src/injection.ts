export interface InjectionScanResult {
  safe: boolean;
  flags: InjectionFlag[];
}

export interface InjectionFlag {
  pattern: string;
  severity: "critical" | "high" | "medium" | "low";
  match: string;
}

const ROLE_MARKERS = /\b(system|assistant|human|user)\s*:/gi;
const IGNORE_INSTRUCTIONS = /\b(ignore|disregard|forget|override|bypass)\s+(all\s+)?(previous|prior|above|earlier|system)\s+(instructions?|rules?|prompts?|guidelines?)/gi;
const ROLEPLAY = /\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be|assume\s+the\s+role|new\s+instructions?)\b/gi;
const UNICODE_BIDI = /[‎‏‪-‮⁦-⁩​‌‍﻿]/g;
const BASE64_BLOCK = /[A-Za-z0-9+/]{64,}={0,2}/g;
const PATH_TRAVERSAL = /\.\.\//g;
const SHELL_INJECTION = /[;&|`$]\s*(rm|cat|curl|wget|nc|bash|sh|python|node|exec)\b/gi;
const PROMPT_DELIMITERS = /(<\|im_start\|>|<\|im_end\|>|\[INST\]|\[\/INST\]|<<SYS>>|<\/SYS>>)/gi;
const XML_INJECTION = /<\s*(system|function_call|tool_use|tool_result|thinking)\b/gi;

const MAX_CONTENT_LENGTH = 10_000;

export function scanForInjection(content: string): InjectionScanResult {
  const flags: InjectionFlag[] = [];

  if (content.length > MAX_CONTENT_LENGTH) {
    flags.push({
      pattern: "oversized_content",
      severity: "medium",
      match: `Content length ${content.length} exceeds ${MAX_CONTENT_LENGTH}`,
    });
  }

  for (const [regex, pattern, severity] of [
    [ROLE_MARKERS, "role_marker", "high"],
    [IGNORE_INSTRUCTIONS, "ignore_instructions", "critical"],
    [ROLEPLAY, "roleplay_attempt", "critical"],
    [UNICODE_BIDI, "unicode_bidi_override", "high"],
    [BASE64_BLOCK, "base64_payload", "medium"],
    [PATH_TRAVERSAL, "path_traversal", "high"],
    [SHELL_INJECTION, "shell_injection", "critical"],
    [PROMPT_DELIMITERS, "prompt_delimiter", "critical"],
    [XML_INJECTION, "xml_tag_injection", "high"],
  ] as [RegExp, string, InjectionFlag["severity"]][]) {
    const matches = content.match(regex);
    if (matches) {
      flags.push({
        pattern,
        severity,
        match: matches[0].slice(0, 80),
      });
    }
  }

  const newlineRatio = (content.match(/\n/g)?.length ?? 0) / Math.max(content.length, 1);
  if (newlineRatio > 0.3 && content.length > 200) {
    flags.push({
      pattern: "excessive_whitespace",
      severity: "low",
      match: `Newline ratio: ${(newlineRatio * 100).toFixed(1)}%`,
    });
  }

  return {
    safe: flags.filter((f) => f.severity === "critical" || f.severity === "high").length === 0,
    flags,
  };
}

export function sanitizeContent(content: string): string {
  let clean = content;
  clean = clean.replace(UNICODE_BIDI, "");
  clean = clean.replace(PROMPT_DELIMITERS, "[FILTERED]");
  if (clean.length > MAX_CONTENT_LENGTH) {
    clean = clean.slice(0, MAX_CONTENT_LENGTH);
  }
  return clean;
}
