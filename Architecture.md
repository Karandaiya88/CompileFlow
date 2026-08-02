# Architecture Document

## SmartCC — Frontend Architecture (Phase 1: Frontend-Only, Mock-Data Driven)

| Field | Value |
|---|---|
| Version | 1.0 |
| Scope | Frontend only — backend is stubbed via mock JSON |
| Related Docs | PRD.md, System.md |

---

## 1. Architectural Principles

1. **Feature-based, not type-based.** Code is organized by product feature (`compiler-workspace`, `dashboard`, `grammar-library`) rather than by technical layer alone.
2. **Mock-first, backend-ready.** All data access goes through a service layer with a stable interface, so swapping mock JSON for real FastAPI calls later requires zero changes to UI components.
3. **Composable UI, not monolithic pages.** Every visualization (Token Viewer, Parse Tree, Symbol Table) is a standalone, reusable component that can be embedded in the Workspace, in Reports, or in a shared/export view.
4. **Strict typing everywhere.** Compiler phase outputs (tokens, AST nodes, TAC instructions) are modeled as TypeScript types shared across the entire frontend — a single source of truth.
5. **Progressive disclosure.** Dashboard shows summaries; Workspace shows depth. No screen tries to show everything at once.

---

## 2. High-Level System Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                         │
│                                                                    │
│  ┌───────────────┐   ┌────────────────────────────────────────┐   │
│  │   Layouts     │   │              Pages (Routes)             │   │
│  │ AppShell,     │   │  Dashboard / Projects / Workspace /      │   │
│  │ Sidebar, Topbar│──▶│  Grammar Library / History / Reports /  │   │
│  └───────────────┘   │  Settings / Help                        │   │
│                       └────────────────────────────────────────┘   │
│                                     │                              │
│                                     ▼                              │
│                       ┌────────────────────────────┐               │
│                       │     Feature Modules         │               │
│                       │  (compiler-workspace, etc.) │               │
│                       └────────────────────────────┘               │
│                                     │                              │
│                     ┌───────────────┼───────────────┐              │
│                     ▼               ▼               ▼              │
│           ┌─────────────┐  ┌───────────────┐ ┌──────────────┐      │
│           │  Components  │  │    Hooks      │ │   Services    │     │
│           │ (UI, shared) │  │ (state logic) │ │ (data access) │     │
│           └─────────────┘  └───────────────┘ └──────┬────────┘     │
│                                                       │              │
│                                                       ▼              │
│                                        ┌───────────────────────┐    │
│                                        │   Mock JSON Fixtures   │    │
│                                        │ (simulated compiler     │    │
│                                        │  phase outputs)         │    │
│                                        └───────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
                                     │
                          (Phase 2 — future)
                                     ▼
                     ┌───────────────────────────────┐
                     │   FastAPI Backend (not built)  │
                     │  Lexer → Parser → Semantic →   │
                     │  IR → Optimizer → Codegen      │
                     └───────────────────────────────┘
```

---

## 3. Folder Structure (Authoritative)

```
frontend/
├── src/
│   ├── app/                     # App bootstrap, providers, router config
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers/           # ThemeProvider, QueryProvider, etc.
│   │
│   ├── layouts/                 # Shell layouts
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   │
│   ├── pages/                   # Route-level containers (thin, compose features)
│   │   ├── DashboardPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── WorkspacePage.tsx
│   │   ├── GrammarLibraryPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── HelpPage.tsx
│   │
│   ├── features/                # Feature-based modules (core business logic)
│   │   ├── compiler-workspace/
│   │   │   ├── components/      # Editor, PipelineStepper, TokenViewer, ParseTree...
│   │   │   ├── hooks/           # useCompile, usePipelineState
│   │   │   ├── types/           # Token, ASTNode, TACInstruction, SemanticReport
│   │   │   └── mocks/           # sampleCompilation.json etc.
│   │   ├── dashboard/
│   │   ├── grammar-library/
│   │   ├── history/
│   │   └── reports/
│   │
│   ├── components/               # Global, cross-feature reusable UI
│   │   ├── ui/                   # shadcn/ui wrapped primitives
│   │   ├── charts/
│   │   ├── data-table/
│   │   └── feedback/             # Toasts, empty states, error boundaries
│   │
│   ├── hooks/                    # App-wide generic hooks (useDebounce, useTheme)
│   ├── services/                 # Data access layer (mock now, API later)
│   │   ├── compilerService.ts    # compile(), getTokens(), getParseTree() ...
│   │   └── mockAdapter.ts        # Swappable adapter pattern
│   │
│   ├── types/                    # Shared/global TypeScript types
│   ├── assets/                   # Icons, illustrations, fonts
│   ├── styles/                   # Tailwind config extensions, theme tokens
│   └── lib/                      # Pure utility functions
│
├── public/
├── index.html
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Data Flow Architecture

### 4.1 Compile Request Flow (Mock Phase)

```
User clicks "Compile"
   → useCompile() hook triggered
   → compilerService.compile(sourceCode) called
   → mockAdapter resolves after simulated delay
   → returns typed CompilationResult:
        { tokens, symbolTable, parseTree, semanticReport,
          tac, optimizedTac, assembly, diagnostics }
   → Pipeline state updated (Zustand/Context store)
   → Each visualization component subscribes to its own
     slice of CompilationResult and re-renders independently
```

### 4.2 Service Layer Contract (Backend-Ready)

The `compilerService` exposes the same interface regardless of data source:

```typescript
interface CompilerService {
  compile(source: string, options?: CompileOptions): Promise<CompilationResult>;
  getGrammar(id: string): Promise<GrammarDefinition>;
  getHistory(projectId: string): Promise<CompilationRecord[]>;
}
```

This means Phase 2 (real FastAPI backend) only requires writing a new adapter — `httpAdapter.ts` — implementing the same interface. **No UI or component code changes required.**

---

## 5. State Management Strategy

| State Type | Tool | Reasoning |
|---|---|---|
| Server/mock data caching | TanStack Query | Handles loading/error/cache states for compile requests uniformly |
| Global UI state (theme, sidebar collapse) | React Context | Lightweight, infrequent updates |
| Pipeline/workspace state (active stage, selected node) | Zustand | Cross-component, frequent updates, no prop drilling |
| Local component state | useState/useReducer | Isolated concerns (editor cursor, panel resize) |

---

## 6. Component Design Standards

- Every visualization component (`TokenViewer`, `ParseTreeView`, `SymbolTableView`, `TACViewer`, `AssemblyViewer`) accepts **typed props only** — never reaches into global state directly. This keeps them portable (usable in Workspace, Reports, or a future "share/export" view).
- Shared primitives (`Card`, `Badge`, `DataTable`, `Tabs`, `Stepper`) live in `components/ui` and are built once on top of shadcn/ui.
- Loading and error states are handled by shared `<AsyncBoundary>` wrapper, not duplicated per component.

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Route-level code splitting; Monaco Editor lazy-loaded |
| Accessibility | Keyboard navigable panels, ARIA labels on interactive visualizations |
| Responsiveness | Fully usable at ≥360px width; Workspace gracefully collapses panels on smaller viewports |
| Theming | Dark theme by default; design tokens centralized in Tailwind config |
| Type Safety | `strict: true` in tsconfig; no implicit `any` |
| Error Handling | Global error boundary + phase-tagged error panel in Workspace |

---

## 8. Migration Path to Real Backend (Phase 2 — Future, Not Current Scope)

1. Build FastAPI service exposing `/compile`, `/grammar/:id`, `/history/:projectId`.
2. Implement `httpAdapter.ts` matching the existing `CompilerService` interface.
3. Swap adapter in `services/compilerService.ts` via environment flag (`VITE_USE_MOCK`).
4. No component-level changes required due to the adapter pattern established in Phase 1.

---

## 9. Delivery Model

Per PRD Section 12, this architecture is built **sprint by sprint**, with explicit approval gates. Suggested sprint breakdown (subject to your confirmation):

1. **Sprint 1** — App shell, routing, layout, design system foundation
2. **Sprint 2** — Dashboard (static + mock charts)
3. **Sprint 3** — Compiler Workspace: Editor + Pipeline Stepper
4. **Sprint 4** — Token Viewer + Symbol Table
5. **Sprint 5** — Parse Tree visualization
6. **Sprint 6** — Semantic Report + TAC + Optimization Comparison
7. **Sprint 7** — Assembly Viewer + Console/Error Panel
8. **Sprint 8** — Grammar Library, History, Reports, Settings, Help
