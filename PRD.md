# Product Requirements Document (PRD)
## SmartCC — Intelligent Mini Compiler & Interactive Compiler Visualizer

| Field | Value |
|---|---|
| Version | 1.0 |
| Status | Draft — Approved for Sprint Planning |
| Owner | Karan Daiya |
| Last Updated | 22 July 2026 |

---

## 1. Executive Summary

SmartCC is a modern, web-based educational compiler platform that helps students understand every phase of compiler design through interactive, real-time visualization.

Traditional compiler-design lab work treats each phase (lexer, parser, semantic analysis, code generation) as an isolated experiment. SmartCC unifies all of these into a single continuous pipeline, so a student can submit one source program and watch it move — stage by stage — from raw text to optimized assembly.

**Design north star:** the product should feel like **VS Code + GitHub + Linear**, not like a college lab assignment.

---

## 2. Problem Statement

Compiler Design courses are typically taught through disconnected experiments:

- Lexical Analyzer
- FIRST / FOLLOW set computation
- Recursive Descent Parser
- Shift-Reduce Parser
- Three Address Code (TAC) generation
- Code Optimization

**Resulting gaps:**

| Problem | Impact |
|---|---|
| No visualization | Students memorize algorithms without seeing them work |
| No end-to-end pipeline | No understanding of how phases connect |
| Poor debuggability | Errors are cryptic, hard to trace to a phase |
| Outdated tooling | CLI-only tools feel disconnected from real engineering |
| No unified UI | Every experiment is a separate, throwaway script |

---

## 3. Proposed Solution

SmartCC accepts C-like source code and runs it through a complete compiler pipeline, rendering every intermediate stage visually and interactively.

```
Source Code
   ↓
Lexical Analysis        → Token stream
   ↓
Syntax Analysis          → Parse tree / AST
   ↓
Semantic Analysis        → Symbol table, type checks
   ↓
Intermediate Code Gen     → Three Address Code (TAC)
   ↓
Optimization              → Optimized TAC (before/after diff)
   ↓
Target Code Generation    → Assembly-like output
   ↓
Interactive Visualization at every stage
```

Each stage is independently viewable, inspectable, and explains itself (what happened, why, and what the output means).

---

## 4. Product Goals

1. Build a complete, working educational compiler experience.
2. Cover the full academic Compiler Design syllabus.
3. Provide interactive, stage-by-stage visualization.
4. Deliver a professional SaaS-grade UI (not a lab-report UI).
5. Maintain a modular, extensible architecture (new languages/phases pluggable later).
6. Produce portfolio-quality software suitable for recruiter/company review.

---

## 5. Target Users

**Primary**
- B.Tech students (Compiler Design / Theory of Computation courses)
- M.Tech students
- Faculty demonstrating compiler concepts in class

**Secondary**
- Universities (as a teaching tool)
- Self-learners studying compilers
- Researchers prototyping small language features

---

## 6. Tech Stack

**Frontend**
- React 19, TypeScript, Vite
- Tailwind CSS, Framer Motion
- React Router
- Monaco Editor (code editing)
- React Flow (parse tree / pipeline visualization)
- TanStack Table (symbol tables, token tables)
- shadcn/ui (component primitives)

**Backend** *(future phase — not built in current sprint cycle)*
- FastAPI, Python
- PLY (Python Lex-Yacc) for lexer/parser core
- SQLAlchemy + PostgreSQL

> **Current build phase uses mock JSON data only.** No backend implementation until explicitly approved (see Section 12).

---

## 7. Functional Requirements (Scope Overview)

- Dashboard
- Project Management
- Code Editor
- Compiler Workspace (core feature)
- Lexical Analysis module
- Syntax Analysis module
- Semantic Analysis module
- Intermediate Code module
- Optimization module
- Assembly Viewer
- Grammar Library
- Compilation History
- Reports
- Settings
- Help / Documentation

---

## 8. Compiler Workspace — Core Screen Requirements

The Compiler Workspace is the primary product surface. It must include:

- Resizable sidebar (project/file navigation)
- Monaco-based code editor
- Compile action (trigger button)
- Visual compiler pipeline (stage indicator/stepper)
- Token Viewer
- Symbol Table
- Parse Tree (interactive, zoomable)
- Semantic Report (errors/warnings/types)
- Three Address Code viewer
- Optimization Comparison (before vs after)
- Assembly Viewer
- Console output
- Error panel (phase-tagged errors)

---

## 9. Dashboard Requirements

- Statistics cards (projects, compilations, error rate, etc.)
- Recent Projects list
- Recent Compilations list
- Pipeline status widget
- Compiler performance metrics
- Quick actions (new project, new compile, open grammar library)
- Charts (compilation trends, phase-wise time distribution)

---

## 10. Compiler Modules (Conceptual, Backend-Facing)

Each of the following is treated as an independent module with its own dedicated page/view in the UI, even while running on mock data:

1. Lexer
2. Parser
3. Semantic Analyzer
4. Intermediate Code Generator
5. Optimizer
6. Target Code Generator

---

## 11. Design Requirements

| Attribute | Requirement |
|---|---|
| Theme | Dark theme, professional, premium |
| Layout | Responsive, minimal, no clutter |
| Inspiration | VS Code, GitHub, Linear |
| Motion | Smooth, purposeful animations (Framer Motion) |
| Components | Rounded cards, excellent spacing, strong typography |

---

## 12. Development Constraints (Binding — Read Before Building)

These are hard constraints for the current phase and override any temptation to over-build:

1. **Frontend only.** Do not implement backend logic in this phase.
2. **Mock JSON data** simulates all compiler phase outputs.
3. Use reusable, typed React components.
4. Follow **feature-based folder architecture** (not type-based dumping).
5. Strict TypeScript — no `any` unless justified.
6. **Sprint-by-sprint delivery.** Do not generate the entire app in one shot.
7. **Explicit approval required after each sprint** before starting the next.

---

## 13. Success Criteria

- Fully responsive UI across breakpoints
- Professional, non-templated UX
- Reusable, composable component library
- Production-quality code organization
- Clean, feature-based folder structure
- Strict TypeScript, no duplicate logic
- Modern React patterns (hooks, composition, no prop-drilling anti-patterns)

---

## 14. Future Scope (Out of Current Roadmap)

- AI-based error explanation (LLM-assisted diagnostics)
- LLVM IR support
- WebAssembly target
- Additional source languages (Java, Python subset)
- Cloud-hosted workspaces
- Multi-user collaboration
- Plugin marketplace for custom compiler passes

---

## 15. Open Questions (To Resolve Before Sprint 1 Kickoff)

- Which compiler phases get their own dedicated route vs. a tabbed view inside Compiler Workspace?
- Should grammar/language rules be user-editable (custom grammar) or fixed to one C-like grammar for v1?
- What is the minimum viable set of mock programs needed to demo all phases convincingly?
