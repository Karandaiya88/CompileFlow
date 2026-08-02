# Memory.md
## SmartCC — AI Engine Context & Memory Architecture

| Field | Value |
|---|---|
| Version | 1.0 |
| Status | **Forward-looking blueprint.** SmartCC's core product (v1–v3) has no AI engine — this document specifies the memory architecture for **"AI Error Explanation"**, listed under PRD.md §14 Future Scope and scheduled at Sprint 21 (Phases.md §5, v4). Nothing in this document is implemented before v4. |
| Depends On | PRD.md §14, Phases.md §5, SystemDesign.md §3 (diagnostic data models) |

---

## 1. Purpose & Scope

When a student's program fails to compile, SmartCC already shows a phase-tagged diagnostic (SystemDesign.md §5). The v4 "AI Error Explanation" feature adds an LLM layer on top that explains *why* the error happened and *how compiler theory concepts* relate to it — in plain language, tied to what the student is currently doing.

This document defines what context the AI Engine needs, and at what scope it should be remembered, so that:
- explanations feel relevant to the *current* compilation, not generic
- the system doesn't silently accumulate irrelevant history across unrelated sessions
- future cohort-level features (e.g., "which errors are most common in this class") have a clean data foundation, without over-building for a use case that may never materialize

---

## 2. Three Memory Scopes

### 2.1 Session Memory (Ephemeral — Default, No Special Design Needed Beyond This)

**Scope:** a single compile-and-explain interaction, or a short sequence of compiles within one open Workspace tab.

**Contains:**
- Current source code
- Current `CompilationResult` (tokens, AST, diagnostics, TAC, etc. — SystemDesign.md §3)
- The last 1–2 prior compile attempts *in the same session*, so the AI can say things like "you fixed the lexical error, but now there's a new semantic error" instead of treating each compile as unrelated.

**Lifetime:** cleared when the Workspace tab/project is closed or the user navigates away. Not persisted to any database.

**Why this is sufficient for most explanations:** the vast majority of "why did this fail" questions only need the current and immediately-prior compilation state — not a student's entire history.

---

### 2.2 Persistent Memory (Per-User, Opt-In, v4+)

**Scope:** carries across sessions for a single logged-in user (requires v3 auth, per Security.md §3).

**Contains (proposed, minimal):**
- Recurring error patterns for this user (e.g., "this user has hit 'undeclared variable' errors 6 times this month") — used only to *tailor tone/depth* of explanation (e.g., skip the basic explanation if they've clearly understood it before, per prior positive feedback on an explanation).
- Explicit user preference: explanation verbosity (concise vs. detailed), stored as a simple setting — not inferred silently.

**What it explicitly does NOT contain:**
- Full transcripts of every past compilation (unnecessary storage, unnecessary AI context bloat).
- Any inferred "skill level" label presented back to the user as a fixed judgment — this risks feeling punitive/demotivating in an educational tool. If skill-adaptive behavior is ever added, it should be framed as adjusting explanation depth, not labeling the student.

**Retention:** user-controlled — a "clear my learning history" action must exist if this scope is ever implemented, consistent with treating this as genuinely optional, not silently collected.

---

### 2.3 Cohort Memory (Aggregate, Anonymized, v4+ — Institutional Use Only)

**Scope:** aggregate patterns across many users in the same class/institution (ties to the `faculty` role in Security.md §3 RBAC).

**Contains:**
- Anonymized, aggregated error-frequency data ("42% of students in this class hit a semantic scope error on Assignment 3") — never tied back to an individual student's identity in the faculty-facing view.

**Explicit constraints:**
- No cohort-level data is ever used to generate per-student explanations (no student is "compared" to peers in their own explanation flow) — this scope is strictly for faculty-facing aggregate reporting, not individual AI context.
- Requires explicit institutional opt-in; not a default-on feature for individual student use of SmartCC.

---

## 3. What Feeds the AI Engine at Explanation Time (v4 Request Shape — Illustrative)

```json
{
  "sessionContext": {
    "currentResult": "CompilationResult (see SystemDesign.md §3)",
    "priorAttempts": ["CompilationResult", "CompilationResult"]
  },
  "persistentContext": {
    "verbosityPreference": "detailed",
    "recentRecurringPhaseErrors": ["semantic"]
  },
  "cohortContext": null
}
```

`cohortContext` is `null` in the individual student explanation flow by design (per §2.3) — it only ever populates the separate faculty reporting view, never the student's own AI explanation request.

---

## 4. Design Principles for This Feature (Binding When v4 Is Built)

1. **Session memory is the default and does most of the work.** Persistent and cohort memory are additive, optional layers — not required for the feature to be useful.
2. **No silent data accumulation.** Persistent memory (§2.2) is opt-in and user-visible/clearable, consistent with Security.md's data-sensitivity principles (§5 there).
3. **Explanations never punish or label.** The system adapts tone/depth, never presents a fixed "your skill level is X" verdict to the student.
4. **Cohort data never leaks into individual explanations.** Hard separation between faculty aggregate view and student-facing AI context, enforced at the request-shape level (§3), not just by convention.
5. **This entire document is inert until v4 (Sprint 21).** No session/persistent/cohort memory code is written during v1–v3 — building it early would mean designing against a product (the real compiler backend) that doesn't exist yet, and risks locking in assumptions before the underlying diagnostic data model (SystemDesign.md §3) has been proven out in production use.
