<div align="center">

# 🧠 AI Engine Context & Memory Architecture
## SmartCC — Forward-Looking Blueprint (v4)

![Status](https://img.shields.io/badge/status-Not%20yet%20built-A1A1A6?style=flat-square)
![Target](https://img.shields.io/badge/target-v4%2C%20Sprint%2021-BC8CFF?style=flat-square)

</div>

> 🔮 **Nothing in this document is implemented before v4.** SmartCC's core product (v1-v2, both complete) has no AI engine. This specifies the memory architecture for **"AI Error Explanation"** ([`PRD.md`](./PRD.md) §14).

---

## 🎯 1. Purpose & Scope

When a program fails to compile, SmartCC already shows a phase-tagged diagnostic. The v4 feature adds an **LLM layer** on top that explains *why* — in plain language, tied to compiler theory.

```mermaid
graph LR
    Fail["🚨 Compilation<br/>fails"] --> Diag["📋 Phase-tagged<br/>diagnostic (today)"]
    Diag -.->|"v4"| AI["🤖 LLM explains<br/>why + theory"]

    style Diag fill:#131316,stroke:#3FB950,color:#EDEDEF
    style AI fill:#131316,stroke:#A1A1A6,color:#EDEDEF
```

This document ensures explanations feel relevant, the system doesn't silently accumulate data, and future cohort features have a clean foundation — **without over-building for a use case that may never materialize.**

---

## 🗂️ 2. Three Memory Scopes

```mermaid
graph TD
    subgraph Session["🟢 Session Memory — Default"]
        S1["Current CompilationResult"]
        S2["Last 1-2 prior attempts"]
    end
    subgraph Persistent["🟡 Persistent Memory — Opt-in, v4+"]
        P1["Recurring error patterns"]
        P2["Verbosity preference"]
    end
    subgraph Cohort["🔴 Cohort Memory — Institutional, v4+"]
        C1["Anonymized class-level stats"]
    end

    Session -->|"most explanations<br/>need only this"| Done1["✅"]
    Persistent -.->|"additive, optional"| Done1
    Cohort -.->|"faculty view only,<br/>never individual"| Done2["🔒"]

    style Session fill:#131316,stroke:#3FB950,color:#EDEDEF
    style Persistent fill:#131316,stroke:#D29922,color:#EDEDEF
    style Cohort fill:#131316,stroke:#F85149,color:#EDEDEF
```

### 🟢 2.1 Session Memory (Ephemeral — Default)

| | |
|---|---|
| **Scope** | A single compile-and-explain interaction |
| **Contains** | Current result + last 1-2 prior attempts in the same session |
| **Lifetime** | Cleared on tab close — never persisted |

> 💡 Most "why did this fail" questions only need current + immediately-prior state.

### 🟡 2.2 Persistent Memory (Per-User, Opt-In, v4+)

| ✅ Contains | ❌ Does NOT contain |
|---|---|
| Recurring error patterns (tailors tone only) | Full transcripts of every compilation |
| Explicit verbosity preference | Any "skill level" label shown to the student |

> 🗑️ Retention is user-controlled — a "clear my learning history" action must exist.

### 🔴 2.3 Cohort Memory (Aggregate, Institutional-Only, v4+)

- Anonymized patterns across a class ("42% hit a scope error on Assignment 3")
- 🔒 **Never** used to generate individual explanations — faculty-facing only

---

## 📦 3. What Feeds the AI Engine (v4 Illustrative Shape)

```json
{
  "sessionContext": {
    "currentResult": "CompilationResult",
    "priorAttempts": ["CompilationResult", "CompilationResult"]
  },
  "persistentContext": {
    "verbosityPreference": "detailed",
    "recentRecurringPhaseErrors": ["semantic"]
  },
  "cohortContext": null
}
```

`cohortContext` is `null` in the student flow **by design** — it only populates the separate faculty reporting view.

---

## 📏 4. Design Principles (Binding When v4 Is Built)

| # | Principle |
|---|---|
| 1️⃣ | 🟢 Session memory does most of the work — others are additive, optional |
| 2️⃣ | 🚫 No silent data accumulation — persistent memory is opt-in and clearable |
| 3️⃣ | 🤝 Explanations never punish or label — depth adapts, verdicts don't |
| 4️⃣ | 🔒 Cohort data never leaks into individual explanations |
| 5️⃣ | ⏸️ **This entire document is inert until v4** — no code written early |

<div align="center">

🔮 *This blueprint waits for* [`Phases.md`](./Phases.md) *Sprint 21 — building it now would mean designing against a product that doesn't exist yet.*

</div>
