# Phases.md
## SmartCC — Version Roadmap & Solo-Builder Sprint Sequencing

| Field | Value |
|---|---|
| Version | 1.0 |
| Builder | Solo (Karan Daiya) |
| Model | Sequential, approval-gated sprints — no parallel workstreams |

---

## 1. Roadmap Overview

| Version | Theme | Backend Involved? | Status |
|---|---|---|---|
| **v1** | Frontend + Mock Data (Full Compiler UI) | No | In Progress |
| **v2** | Real Backend Compiler Engine (FastAPI + PLY) | Yes | Planned |
| **v3** | Persistence, History, Multi-Project Support | Yes | Planned |
| **v4** | AI-Assisted Features (Error Explanation, LLVM/WASM exploration) | Yes | Future |

Because this is a **solo build**, phases are strictly sequential — v2 does not start until v1 is fully approved and demo-ready, and so on. This avoids half-finished parallel branches, which is the most common way solo portfolio projects stall.

---

## 2. v1 — Frontend + Mock Data (Current Phase)

**Goal:** A fully working, visually complete compiler UI running entirely on mock JSON — good enough to demo end-to-end without any backend.

| Sprint | Deliverable | Approval Gate |
|---|---|---|
| Sprint 1 | App shell, routing, layout, design system foundation | ✅ Required |
| Sprint 2 | Dashboard (stats cards, recent projects/compilations, charts) | ✅ Required |
| Sprint 3 | Compiler Workspace shell: Monaco editor + Pipeline stepper | ✅ Required |
| Sprint 4 | Token Viewer + Symbol Table | ✅ Required |
| Sprint 5 | Parse Tree visualization (React Flow) | ✅ Required |
| Sprint 6 | Semantic Report + TAC Viewer + Optimization Comparison | ✅ Required |
| Sprint 7 | Assembly Viewer + Console + Error Panel | ✅ Required |
| Sprint 8 | Grammar Library, History, Reports, Settings, Help | ✅ Required |

**v1 exit criteria:** every PRD functional requirement is visually demonstrable with realistic mock data; fully responsive; zero TypeScript errors; portfolio-ready to show in an interview.

---

## 3. v2 — Real Backend Compiler Engine

**Goal:** Replace the mock adapter with a real FastAPI + PLY backend that actually lexes, parses, and analyzes submitted code.

| Sprint | Deliverable |
|---|---|
| Sprint 9 | FastAPI project scaffold, `/compile` endpoint skeleton (see API-spec.md) |
| Sprint 10 | Real Lexer (PLY) wired to `/compile`, replacing mock tokens |
| Sprint 11 | Real Parser → AST, replacing mock parse tree |
| Sprint 12 | Semantic Analyzer (symbol table, type checks) |
| Sprint 13 | TAC generation + Optimizer passes |
| Sprint 14 | Target code generation (assembly-like output) |
| Sprint 15 | Swap `mockAdapter` → `httpAdapter` in frontend (per Architecture.md §8); end-to-end integration testing |

**v2 exit criteria:** a real program submitted by a user is genuinely compiled through all phases — no mock fallback needed for the core pipeline.

---

## 4. v3 — Persistence & Multi-Project Support

**Goal:** Projects, compilation history, and grammar customizations persist across sessions.

| Sprint | Deliverable |
|---|---|
| Sprint 16 | PostgreSQL schema + SQLAlchemy models (see DatabaseDesign.md — to be written at this phase) |
| Sprint 17 | Project CRUD (create/rename/delete projects) |
| Sprint 18 | Compilation history persistence + retrieval |
| Sprint 19 | Basic auth (single-user or lightweight multi-user, per Security.md) |
| Sprint 20 | Reports powered by real historical data instead of client-derived mock stats |

---

## 5. v4 — AI-Assisted Features & Advanced Targets

**Goal:** Differentiated, "wow factor" features for the portfolio narrative.

| Sprint | Deliverable |
|---|---|
| Sprint 21 | AI Error Explanation (LLM-assisted diagnostics on semantic/syntax errors) — see Memory.md for context architecture |
| Sprint 22 | LLVM IR exploration (stretch) |
| Sprint 23 | WebAssembly target exploration (stretch) |
| Sprint 24 | Polish pass: performance, accessibility audit, final portfolio packaging |

---

## 6. Solo-Builder Sequencing Rules

1. **One sprint in flight at a time.** No starting Sprint N+1 before Sprint N is approved.
2. **No version-skipping.** v2 backend work does not begin mid-way through v1 sprints, even if it seems "quick."
3. **Re-baseline after each version.** At the end of v1, v2, v3, pause and re-confirm the next version's sprint breakdown still makes sense (requirements may shift after seeing v1 in practice).
4. **Documentation debt is not allowed to compound.** API-spec.md, Security.md, and DatabaseDesign.md details get filled in with real specifics at the start of the version that needs them — not left as permanently-aspirational documents.

---

## 7. Current Status Tracker

| Item | Status |
|---|---|
| PRD.md | ✅ Approved |
| Architecture.md | ✅ Approved |
| SystemDesign.md | ✅ Approved |
| Rules.md | ✅ Approved (this batch) |
| Phases.md | ✅ Approved (this batch) |
| Design.md | ⏳ In review (this batch) |
| API-spec.md | ⏳ Forward-looking blueprint (this batch) |
| Security.md | ⏳ Forward-looking blueprint (this batch) |
| Testing.md | ⏳ In review (this batch) |
| Memory.md | ⏳ Forward-looking blueprint (this batch) |
| Sprint 1 code | 🔜 Next, pending doc sign-off |
