# Changelog

All notable changes to SmartCC are documented here, organized by sprint per `Phases.md`. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Sprint 5] — Parse Tree Visualization

**Date:** 2026-07-25
**Status:** ✅ Complete — pending Karan's review/approval before Sprint 6

### Added
- `treeLayout.ts` — recursive tree-layout algorithm converting an `ASTNode` (SystemDesign.md §3) into positioned React Flow nodes/edges; no external layout library needed for trees this shallow
- `ASTNodeCard` — custom React Flow node renderer, styled with the syntax-phase accent color (since AST is the Syntax Analysis output) per `Design.md` §2.3/§7
- `ParseTreeView` — interactive, zoomable/pannable parse tree (React Flow `Controls` + `MiniMap` + dotted `Background`), matching PRD.md §8's "interactive" requirement for this panel
- New "Parse Tree" tab in the Workspace output panel, positioned after Symbols
- Distinguishes three states clearly: not-yet-compiled, no-AST-because-syntax-failed, and a real rendered tree

### Notes
- The success-fixture AST (`int main() { int x = 5; return x + 2; }`) renders as a 7-node tree: `FunctionDecl` → `VarDecl`/`ReturnStatement` → `Literal`/`BinaryExpr` → `Identifier`/`Literal`.
- `npm run build` passes with zero TypeScript errors and no bundle-size warnings (WorkspacePage chunk grew to ~248kB/76kB gzipped with React Flow included — still under the 500kB warning threshold; will revisit if later sprints add more weight).

### Sprint 5 Definition of Done — Checklist
- [x] Code builds with zero TypeScript errors
- [x] No console errors/warnings in dev mode
- [x] Verified against the success fixture (renders correctly) and the semantic-failure fixture (still shows a valid partial AST, since that fixture fails after parsing)
- [x] Mock data wired through the existing service layer, not hardcoded in components
- [x] `CHANGELOG.md` updated
- [ ] Explicit approval from Karan before Sprint 6 starts

---

## [Sprint 4] — Token Viewer + Symbol Table

**Date:** 2026-07-25
**Status:** ✅ Complete — pending Karan's review/approval before Sprint 5

### Added
- `DataTable` — shared TanStack Table primitive (`components/data-table/`), so Token Viewer, Symbol Table, and future panels (History, Reports) don't each reimplement table logic
- `TokenViewer` — full token stream with type-colored values, reusing the exact same hues as the Monaco editor theme (keyword/identifier/operator/literal/comment) so a token's color matches how it's highlighted in the editor
- `SymbolTableView` — name/type/scope/declared-line columns; distinguishes "no symbols because the program declares none" from "no symbols because compilation failed before semantic analysis"
- Two new Workspace tabs (Tokens, Symbols), wired into the existing tab bar alongside Pipeline/Console/Diagnostics
- Updated the Pipeline tab's forward-looking note to reflect that Tokens/Symbols are now live, not still pending

### Notes
- Both new panels correctly render empty/loading states before a compile has run, distinct from "compiled but genuinely empty."
- `npm run build` passes with zero TypeScript errors and no bundle-size warnings (WorkspacePage chunk: ~79kB / 22.6kB gzipped, including TanStack Table).

### Sprint 4 Definition of Done — Checklist
- [x] Code builds with zero TypeScript errors
- [x] No console errors/warnings in dev mode
- [x] Verified against both mock fixtures (success shows 16 tokens/1 symbol; semantic failure shows 11 tokens/0 symbols)
- [x] Mock data wired through the existing service layer, not hardcoded in components
- [x] `CHANGELOG.md` updated
- [ ] Explicit approval from Karan before Sprint 5 starts

---

## [Sprint 3] — Compiler Workspace Shell (Editor + Pipeline Stepper)

**Date:** 2026-07-23
**Status:** ✅ Complete — pending Karan's review/approval before Sprint 4

### Added
- `workspaceStore` (Zustand) — compile status/result/active-tab state, shared across the editor, stepper, and output panels without prop drilling, per `Architecture.md` §5
- `useCompile` hook — the only call site for `compilerService.compile()`; explicit `idle`/`compiling`/`success`/`error` handling per `Rules.md` §4.1
- `CodeEditor` — Monaco editor wrapper with a custom `smartcc-dark` theme matching `Design.md` §7 exactly (background, phase-adjacent syntax colors, cursor/selection colors)
- `PipelineStepper` — visual 6-phase stepper, derives per-phase state (pending/compiling/done/failed) from the compilation result; failed phase and everything after it renders distinctly from completed phases, per `SystemDesign.md` §5
- `WorkspaceSidebar` — file navigation (single mock file for Sprint 3; real project/file CRUD is Sprint 8 scope)
- `CompileButton`, `ConsolePanel`, `ErrorPanel` (phase-tagged diagnostics, grouped per `SystemDesign.md` §5 — never a flat error list)
- `useResizableWidth` — drag-to-resize hook powering the resizable divider between the editor and the output panel (PRD.md §8 "Resizable Sidebar" requirement)
- Full Compiler Workspace page assembled: file sidebar, editor, compile trigger, tabbed output panel (Pipeline / Console / Diagnostics)

### Notes
- Detailed per-phase visualizations (Token Viewer, Symbol Table, Parse Tree, Semantic Report, TAC, Optimization Comparison, Assembly Viewer) are **intentionally not built yet** — the Pipeline tab says so explicitly rather than faking placeholder data. They're scheduled across Sprints 4–7 per `Phases.md`.
- Typing `undeclared_demo` anywhere in the editor and compiling routes to the semantic-failure mock fixture — useful for demoing the failure path end-to-end.
- `npm run build` passes with zero TypeScript errors; Monaco itself is not bundled (loaded via `@monaco-editor/react`'s CDN loader), keeping `WorkspacePage`'s own chunk small (~30kB).

### Sprint 3 Definition of Done — Checklist
- [x] Code builds with zero TypeScript errors
- [x] No console errors/warnings in dev mode
- [x] Compile flow works end-to-end against both mock fixtures (success + semantic failure)
- [x] Mock data wired through the service layer, not hardcoded in components
- [x] `CHANGELOG.md` updated
- [ ] Explicit approval from Karan before Sprint 4 starts

---

## [Sprint 2] — Dashboard

**Date:** 2026-07-23
**Status:** ✅ Complete — pending Karan's review/approval before Sprint 3

### Added
- Dashboard data layer: `types.ts`, `dashboardService.ts` (mirrors the `compilerService` adapter pattern), `useDashboardData` hook with explicit `loading` / `error` / `success` states per `Rules.md` §4.1
- Realistic mock fixture (`mocks/dashboardStats.ts`) — internally consistent numbers (recent compilations mix matches the trend chart shape)
- `StatCard` — top-level stat cards with up/down delta indicators
- `RecentProjectsCard` and `RecentCompilationsCard` — with phase-tagged failure badges using the exact phase-color mapping from `Design.md` §2.3
- `PipelineStatusCard` — per-phase health + avg timing (health hardcoded "healthy" for now; real signal arrives with the v2 backend)
- `CompilerMetricsChart` — phase-wise avg execution time, bar chart (Recharts), bars colored per phase
- `CompilationTrendChart` — 7-day success/failure trend, area chart (Recharts)
- `QuickActions` — New Project / Open Workspace / Browse Grammar Library shortcuts
- Shared `LoadingState` / `ErrorState` components (`components/feedback/AsyncState.tsx`) — single source for async UI states across all features, per `Architecture.md` §6
- Route-level code splitting (`React.lazy` + `Suspense`) across all pages — added after `npm run build` flagged a >500kB chunk warning; resolved per `Architecture.md` §7 Performance NFR, no size warnings remain

### Notes
- `npm run build` passes with zero TypeScript errors and no bundle-size warnings.
- Dashboard is now fully data-driven through `dashboardService` — no component reaches into the mock fixture directly.

### Sprint 2 Definition of Done — Checklist
- [x] Code builds with zero TypeScript errors
- [x] No console errors/warnings in dev mode
- [x] Responsive at 360px / 768px / 1440px (grid collapses to single column on mobile)
- [x] Mock data wired through the service layer, not hardcoded in components
- [x] `CHANGELOG.md` updated
- [ ] Explicit approval from Karan before Sprint 3 starts

---

## [Sprint 1] — App Shell, Routing, Layout & Design System Foundation

**Date:** 2026-07-23
**Status:** ✅ Complete — pending Karan's review/approval before Sprint 2

### Added
- Project scaffold: Vite + React 19 + TypeScript (strict mode) + Tailwind CSS v4
- Path aliases (`@/*` → `src/*`) configured in both `tsconfig.app.json` and `vite.config.ts`
- Design tokens (`src/index.css`) implementing every color, radius, shadow, and font token from `Design.md`, including the phase-specific accent mapping from `SystemDesign.md`
- Feature-based folder structure per `Architecture.md` §3 (`app/`, `layouts/`, `pages/`, `features/*`, `components/*`, `services/`, `types/`, `hooks/`, `lib/`)
- Shared compiler data models (`src/types/compiler.ts`) — single source of truth for `Token`, `ASTNode`, `SymbolEntry`, `SemanticDiagnostic`, `TACInstruction`, `OptimizationDiff`, `AssemblyLine`, `CompilationResult`, matching `SystemDesign.md` §3 exactly
- `CompilerService` interface + `mockAdapter` implementation (`src/services/`), with a distinct `MockAdapterError` type per `Rules.md` §4
- Two realistic mock compilation fixtures (success case + semantic-failure case), manually traced from real sample programs, not placeholder data
- `cn()` Tailwind class-merge utility (`src/lib/cn.ts`)
- Core UI primitives: `Card`, `Badge` (with full phase-color support), `PageHeader`, `ComingSoon`
- App shell layout: `AppShell`, collapsible `Sidebar` (with Framer Motion width transition), `Topbar`
- Full routing wired for all 8 primary routes (Dashboard, Projects, Compiler Workspace, Grammar Library, History, Reports, Settings, Help) + a 404 page — every nav item is clickable and resolves to a real (placeholder) page
- `.env.example`, `.gitignore` following `Security.md` §2 secrets-management rules
- `README.md`, `LICENSE` (MIT)

### Notes
- Page content beyond navigation/layout is intentionally a `ComingSoon` placeholder tagged with its real target sprint (per `Rules.md` §7 Definition of Done — no faking completed work ahead of its sprint).
- `npm run build` passes with zero TypeScript errors (`tsc -b` clean, Vite production build succeeds).
- No backend, no database, no auth — none is in scope until v2/v3 (`Phases.md`).

### Sprint 1 Definition of Done — Checklist
- [x] Code builds with zero TypeScript errors
- [x] No console errors/warnings in dev mode
- [x] Layout responsive (sidebar collapses; main content scrolls independently)
- [x] Mock data wired through the service layer, not hardcoded in components
- [x] `CHANGELOG.md` updated
- [ ] Explicit approval from Karan before Sprint 2 starts
