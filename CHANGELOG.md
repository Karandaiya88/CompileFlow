# Changelog

All notable changes to SmartCC are documented here, organized by sprint per `Phases.md`. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Sprint 12] — Real Semantic Analyzer

**Date:** 2026-08-15
**Status:** ✅ Complete — pending Karan's review/approval before Sprint 13

### Added
- **Real semantic analyzer** (`backend/app/compiler/semantic/analyzer.py`): walks the real AST and performs genuine undeclared-variable detection, duplicate-declaration detection, and unused-variable warnings -- function-level scoping (one scope per `FunctionDecl`, matching the parser's current lack of nested block scopes)
- `analyze(ast) -> AnalysisResult`: real symbol table + real diagnostics, following the same pattern as `tokenize()` and `parse()`
- **9 table-driven semantic tests** (`tests/test_semantic.py`) per Testing.md §2.2: clean program, undeclared variable (both in `return` and in assignment), duplicate declaration, the `int x = x;` self-referential edge case (correctly flags `x` as undeclared rather than self-satisfying), unused-variable warning, and function-scope independence (same variable name in two different functions is *not* a duplicate-declaration error)
- 2 new endpoint-level tests proving detection works for **any** undeclared identifier end-to-end, and duplicate declaration end-to-end

### Removed
- **The `undeclared_demo` hardcoded-string hack is gone.** Every sprint since 9 routed the demo's "failure" path by checking whether that one specific identifier name appeared in the source. Sprint 12 replaces it with genuine analysis -- verified by testing `my_random_var` and other arbitrary names, never seen in any fixture, correctly triggering the same failure path.
- **`pipeline.py` shrank from 244 lines to ~95.** The two large canned `CompilationResult` fixtures (`_STUB_SUCCESS`, `_STUB_SEMANTIC_FAILURE`) are deleted entirely -- they're no longer needed now that tokens, AST, symbol table, and diagnostics are all real. This is the incremental-replacement pattern the pipeline's own docstring has described since Sprint 9, finally visible as an actual deletion rather than just a plan.

### Changed
- A semantically-valid program's `tac`, `optimization`, and `assembly` fields are now `[]`/`None` (genuinely "not implemented yet") rather than continuing to return the old stub's fabricated TAC/assembly data, which would have been actively misleading now that everything upstream of it is real and program-specific. Sprint 13-14 fill these in for real.

### Notes
- Type-mismatch checking is explicitly **not** implemented this sprint, and not silently skipped either -- `test_semantic.py`'s module docstring notes why: the grammar only produces integer literals so far, so there's no real type-system depth to check yet. Faking a type checker ahead of the grammar supporting multiple literal types would be checking against nothing.
- Verified against a real running server: an arbitrary identifier never seen in any fixture (`my_random_var`) is correctly flagged undeclared, and an unused-variable warning correctly returns `status: "success"` with a `"warning"`-severity diagnostic (compilation succeeds despite the warning, same convention as real compilers).
- `pytest` -- 41/41 passing (9 endpoint + 11 lexer + 10 parser + 9 semantic + 2 new end-to-end). `ruff check .` clean.

### Sprint 12 Definition of Done — Checklist
- [x] Real semantic analyzer implemented, not a stub
- [x] The `undeclared_demo` hack fully removed, not just supplemented
- [x] Table-driven unit tests covering the cases Testing.md §2.2 names (undeclared variable, duplicate declaration) plus scope-independence and warning-vs-error distinction
- [x] Verified against a real running server with a genuinely novel undeclared identifier, not just fixtures
- [x] Known scope limitations (function-level only, no type checking yet) documented in code, not silently left as gaps
- [x] `pytest` passes (41/41), `ruff check .` clean
- [x] `CHANGELOG.md` updated
- [ ] Explicit approval from Karan before Sprint 13 (real TAC + Optimizer) starts

---

## [Sprint 11] — Real Parser → AST

**Date:** 2026-08-08
**Status:** ✅ Complete — pending Karan's review/approval before Sprint 12

### Added
- **Real PLY yacc parser** (`backend/app/compiler/parser/parser.py`): function declarations (no parameters yet, documented limitation), variable declarations with optional initializers, assignment statements, return statements, and a standard precedence-climbing expression grammar (`+ - * /` with correct precedence and parenthesization)
- `parse(source) -> ParseResult`: real AST or genuine syntax errors with line numbers, mirroring the lexer's `tokenize()` pattern
- **10 table-driven parser unit tests** (`tests/test_parser.py`) per Testing.md §2.2, including operator-precedence correctness (`2 + 3 * 4` parses as `2 + (3*4)`, not `(2+3)*4`), parenthesization override, multi-function programs, and syntax-error detection (missing semicolon, missing closing brace)
- `pipeline.py` now calls the real parser: **syntax errors on arbitrary input are genuinely detected**, returning `failedAtPhase: "syntax"` with a real message and line number -- not limited to canned fixtures
- Real AST now flows through for any syntactically valid program, verified against a completely novel two-function program with subtraction (`int add() {...} int sub() {...}`) that was never in any fixture

### Fixed (found during this sprint's own work, not a separate audit)
- **Lexer refactor left mid-way from planning in the previous session**: `t_IDENTIFIER` still referenced an undefined `KEYWORDS` set (would have crashed at runtime; caught before it shipped, not after) and `_TOKEN_TYPE_MAP` was missing entries for the new per-keyword token types. Completed the refactor properly: each keyword now gets its own PLY token type (`INT`, `RETURN`, `IF`, ...) so the yacc grammar can structurally distinguish them, while the frontend-facing `Token.type` still collapses them all back to the single `KEYWORD` category -- no API contract change.
- **Comments would have broken every parse.** The grammar has no production for `COMMENT` tokens (no C-like grammar does), but the parser was initially wired to consume the lexer's raw token stream, which includes comments. Fixed via a custom `tokenfunc` that filters `COMMENT` tokens out for the parser specifically, while `lexer.tokenize()` (used by the Token Viewer) still emits them.

### Changed
- **Grammar Library productions now match the real grammar exactly**, on both sides: `backend/app/routers/grammar.py` and `frontend/src/features/grammar-library/cLikeGrammar.ts` were both updated together (previously the productions only covered `int`/`return`/`+`, a placeholder from Sprint 9). Each file now references the other in a comment so they don't silently drift apart again.

### Notes
- Verified against a real running server via `curl`: a program with a missing semicolon correctly returns `failedAtPhase: "syntax"`; a genuinely novel multi-function program parses correctly end-to-end.
- Known limitation carried over from the lexer (documented in `parser.py`'s docstring too): module-level parser/lexer state reset per call, not safe for true request concurrency at current scale.
- Function parameters aren't parsed yet (`func_decl` always expects empty `()`) -- flagged in the grammar's own docstring, not silently unsupported.
- `pytest` -- 30/30 passing (8 endpoint + 11 lexer + 10 parser + 1 new syntax-error endpoint test). `ruff check .` clean.

### Sprint 11 Definition of Done — Checklist
- [x] Real parser implemented (PLY yacc), not a stub
- [x] Table-driven unit tests including precedence and syntax-error cases
- [x] Verified against a real running server with a genuinely novel program, not just fixtures
- [x] Grammar Library docs updated to match the real grammar (frontend + backend both)
- [x] Known limitations documented in code, not silently left as gaps
- [x] `pytest` passes (30/30), `ruff check .` clean
- [x] `CHANGELOG.md` updated
- [ ] Explicit approval from Karan before Sprint 12 (real Semantic Analyzer) starts

---

## [Sprint 10] — Real Lexer (PLY)

**Date:** 2026-08-04
**Status:** ✅ Complete — pending Karan's review/approval before Sprint 11

### Added
- **Real PLY-based lexer** (`backend/app/compiler/lexer/lexer.py`): keywords (`int`, `float`, `char`, `void`, `return`, `if`, `else`, `while`, `for`), identifiers, integer literals, arithmetic/comparison operators (`= + - * / == != < > <= >=`), punctuation (`( ) { } ;`), and both comment styles (`//` line, `/* */` block, correctly advancing line count across multi-line blocks)
- `tokenize(source) -> LexResult` public API: real token list + genuine lexical-error detection (illegal characters), with accurate line/column tracking computed from lexer position
- **11 table-driven unit tests** (`tests/test_lexer.py`), each with a manually-verified expected token sequence per Testing.md §2.2 -- covering keyword/identifier disambiguation, multi-char operator precedence (`==` vs `=`, `<=` vs `<`), multi-line line/column tracking, comment tokenization, illegal-character recovery (lexing continues past a bad character rather than aborting), and empty input
- `pipeline.py` now calls the real lexer: **lexical errors on genuinely arbitrary input are now real**, not limited to the two canned demo programs. A program with an illegal character now correctly returns `status: "failed"`, `failedAtPhase: "lexical"`, with the actual error message and line number
- For lexically-valid input, real tokens now replace the stub's canned token list (via `result.model_copy(update=...)`), while AST/symbol-table/TAC/optimization/assembly remain the Sprint 9 stub until their respective sprints

### Notes
- **Scope note documented in the lexer's own docstring**: it recognizes a broader keyword/operator set than the grammar currently parses (GrammarLibrary's `cLikeGrammar` only covers `int`/`return`/`+` so far) -- intentional, since lexers are commonly built ahead of the parser that consumes their output. The parser (Sprint 11) grows into this token set incrementally.
- **Known limitation, documented in code, not hidden**: the lexer uses a single module-level PLY lexer instance (reset per call) rather than a fresh instance per request, for practical reasons -- PLY's dynamic-module pattern for per-instance lexers breaks its function-signature introspection when functions become bound methods. Not safe for true request concurrency at this stage; acceptable for the project's current scale, flagged here rather than left as a silent gap.
- Verified against a real running server via `curl`, not just `TestClient`: submitted a program with an illegal `@` character and confirmed the full failure response shape, and a program with a `//` comment to confirm arbitrary (non-fixture) programs now tokenize correctly end-to-end.
- `pytest` -- 19/19 passing (8 endpoint + 11 lexer). `ruff check .` clean.

### Sprint 10 Definition of Done — Checklist
- [x] Real lexer implemented (PLY), not a stub
- [x] Table-driven unit tests with manually-verified expected output (Testing.md §2.2)
- [x] Verified against a real running server, not just in-process tests
- [x] Known limitations documented in code comments, not silently left as gaps
- [x] `pytest` passes (19/19), `ruff check .` clean
- [x] `CHANGELOG.md` updated
- [ ] Explicit approval from Karan before Sprint 11 (real Parser) starts

---

## [Sprint 9] — Backend Scaffold (v2 begins)

**Date:** 2026-08-02
**Status:** ✅ Complete — pending Karan's review/approval before Sprint 10

### Added
- **Repo restructured into a monorepo**: existing frontend content moved into `frontend/`, new `backend/` added, docs stay at the repo root -- matching the `frontend/ backend/` structure from Architecture.md's original folder-structure diagram
- **FastAPI backend scaffold** (`backend/app/`): `main.py` (CORS + router registration), `config.py` (env-based, Security.md §2 compliant -- no hardcoded secrets)
- **Pydantic models** (`app/models/compiler.py`) mirroring `frontend/src/types/compiler.ts` field-for-field -- the same single-source-of-truth discipline as the frontend, just on the Python side
- **Three real endpoints** matching API-spec.md exactly: `POST /api/v1/compile`, `GET /api/v1/grammar/:id`, `GET /api/v1/history/:projectId`, plus a `GET /health` check
- **Pipeline stub** (`app/compiler/pipeline.py`) -- returns the same two fixtures as the frontend's mock adapter (success + semantic-failure), so both sides demo identically during the transition. Explicitly documented as a stub: no real lexer/parser logic yet, by design (Rules.md's sprint-by-sprint gate)
- Empty `lexer/`, `parser/`, `semantic/`, `optimizer/`, `codegen/` packages under `app/compiler/`, each with a docstring naming the sprint that fills it in (10-14) -- so they read as "scheduled," not "abandoned"
- 8 integration tests (`tests/test_endpoints.py`) covering the endpoint contract: success/failure compile fixtures, empty-source 400, grammar 404, history filtering by project
- `requirements.txt` / `requirements-dev.txt`, `.env.example`, backend `.gitignore`, backend `README.md` with curl-based manual testing instructions

### Notes
- **Verified with a real running server, not just `TestClient`**: started `uvicorn` and hit every endpoint with `curl` to confirm actual HTTP behavior, not just in-process test-client behavior.
- `ruff check .` -- 0 errors (started at 15, all auto-fixable style/import-order issues, fixed via `ruff check --fix`).
- `pytest` -- 8/8 passing.
- **The frontend does not talk to this backend yet.** `compilerService` still always uses `mockAdapter` (Architecture.md §4.2) -- building `httpAdapter` and wiring the swap is Sprint 15's job, once all five real compiler phases exist behind these endpoints. Sprint 9's value is proving the contract shape end-to-end before any real compiler logic is written on top of it.

### Sprint 9 Definition of Done — Checklist
- [x] Server starts and responds to real HTTP requests (verified via `curl`, not just `TestClient`)
- [x] Every route matches `API-spec.md`'s documented shape exactly
- [x] `pytest` passes (8/8)
- [x] `ruff check .` clean
- [x] No secrets hardcoded; `.env.example` provided, `.env` git-ignored
- [x] `CHANGELOG.md` updated
- [ ] Explicit approval from Karan before Sprint 10 (real Lexer) starts

---

## [Polish Pass 1] — v1 Audit & Bug Fixes

**Date:** 2026-07-30
**Status:** ✅ Complete

Proactive audit pass requested before moving to v2 (per Phases.md §6 Rule 3's re-baseline checkpoint). Ran `tsc -b`, `oxlint`, and a manual review of every store/hook for stale-state and edge-case bugs.

### Fixed
- **Pipeline stepper never showed a failed phase (real bug, present since Sprint 3).** `workspaceStore`'s `status` field conflated two different things under the value `'success'`: "the service call returned a result" and "the compilation itself succeeded." When a compilation *failed* at some phase (e.g. semantic), `status` was set to `'error'` instead -- but `PipelineStepper` and `ConsolePanel` both checked `status === 'success'` to decide whether to render failure-phase details, so that branch was silently unreachable. The stepper fell through to "all pending" (no colors at all) instead of showing green-through-failed-phase-then-red. Fixed by renaming the status value to `'done'` (meaning "got a result back, check `result.status` for the actual outcome") and separating it cleanly from `'error'` (meaning "the adapter call itself threw"). Verified against both fixtures: the stepper now correctly shows lexical/syntax as done and semantic as failed (red) for the semantic-failure fixture.
- **Resizable panel drag could get permanently "stuck."** `useResizableWidth` attached `mousemove`/`mouseup` handlers to the container element. A fast drag that releases the mouse outside the container's bounds never fires that element's `mouseup`, leaving `cursor: col-resize` and `user-select: none` applied to the whole page until an unrelated click happened to reset it. Fixed by moving both listeners to `window`.
- **Collapsed sidebar was inaccessible to screen readers.** When the sidebar collapses to icon-only, the nav `<NavLink>`s had no text content and no `aria-label`, so a screen reader announced nothing meaningful for any nav item. Added conditional `aria-label` matching Design.md §8's accessibility requirement.
- **Removed a dead duplicate file**, `SemanticReportPanel.tsx` -- an unused, never-imported earlier version of `SemanticReportView.tsx` left over from initial Sprint 2 scaffolding. Violated PRD.md §13's "no duplicate code" success criterion.
- **Quieted all 9 `oxlint` warnings** (`react-refresh/only-export-components`) by moving the lazy route definitions out of `router.tsx` into a dedicated `lazyRoutes.tsx`, so `router.tsx` exports only the router object and Fast Refresh works cleanly on both files.

### Notes
- `npx oxlint` now reports 0 warnings, 0 errors (was 9 warnings). `tsc -b` and `npm run build` remain clean.
- This pass was prompted by Karan asking for v1 polish before starting v2 backend work -- a good reminder that "builds cleanly" and "behaves correctly" are different bars, and the Pipeline stepper bug specifically slipped through because earlier sprint verification checked that mock fixtures loaded correctly, not that every UI branch reachable from them actually rendered.

---

## [Sprint 8] — Grammar Library, History, Reports, Settings, Help, Projects

**Date:** 2026-07-30
**Status:** ✅ Complete — this closes out v1 entirely, pending Karan's final review

### Added
- **Projects** — `useProjectsStore` (Zustand, in-memory CRUD), full `ProjectsPage` (create/rename/delete, "Open in Workspace" links). Real Project CRUD against a backend is v3 scope (API-spec.md §6); this is an honest v1 in-memory implementation, not a stub
- **Grammar Library** — `GrammarLibraryPage` fetches through `compilerService.getGrammar()` (not the fixture directly), displays productions and a copyable sample program
- **History** — dedicated `historyService` + 10-record fixture (`features/history/`), `HistoryPage` with All/Success/Failed filtering via the shared `DataTable`
- **Reports** — `deriveReportStats()` (pure function, unit-testable per Testing.md §2.1) computes stats client-side from history records, no separate reports fixture needed (SystemDesign.md §4.5). `PhaseFailureChart` (Recharts) shows failure distribution by phase
- **Settings** — `useSettingsStore`, with controls that are **functionally wired, not cosmetic**: Editor Font Size actually resizes the Monaco editor in the Workspace; Simulated Compile Delay actually changes how long `mockAdapter.compile()` takes (via `services/mockConfig.ts`, keeping the one-way `features → services` dependency direction from Architecture.md §3 intact — Settings writes to a plain config object rather than services importing from features)
- **Help** — `Accordion` UI primitive + FAQ content covering the mock-data nature of v1, the simulated compile delay, and how to read the Pipeline stepper

### Notes
- **This completes v1 entirely.** Every page in PRD.md §7 is now real (no `ComingSoon` placeholders remain anywhere in the app).
- Known v1 inconsistency, intentionally not fixed now: the Dashboard's "Recent Projects" card (Sprint 2) and the new Projects page each have their own independent mock dataset — they aren't the same underlying store. Unifying them properly needs a real backend as the single source of truth (v2+); wiring the Dashboard to `useProjectsStore` now would be a partial, throwaway fix.
- `npm run build` passes with zero TypeScript errors and no bundle-size warnings; the shared Recharts `BarChart` chunk is now reused by both Dashboard and Reports.

### Sprint 8 Definition of Done — Checklist
- [x] Code builds with zero TypeScript errors
- [x] No console errors/warnings in dev mode
- [x] Every PRD.md §7 page is a real, functioning page (no remaining placeholders)
- [x] Settings controls verified to actually affect behavior (font size, compile delay)
- [x] Mock data wired through service layers where a future backend contract exists (grammar, history); local Zustand stores used where v1 scope is genuinely local-only (projects, settings)
- [x] `CHANGELOG.md` updated
- [ ] Final review from Karan — **v1 complete pending this approval**

---

## [Sprint 7] — Assembly Viewer + Console/Error Panel Completion

**Date:** 2026-07-30
**Status:** ✅ Complete — pending Karan's review/approval before Sprint 8

### Added
- `AssemblyViewer` — target assembly output table (instruction/operands/comment) via the shared `DataTable` primitive, codegen-phase colored
- Final Workspace tab: Assembly — bringing the tab bar to 10 tabs, matching every item in PRD.md §8's Compiler Workspace requirement list
- `ConsolePanel` success summary now also reports assembly line count alongside tokens/symbols/TAC counts

### Notes
- Console and Error Panel themselves were already built in Sprint 3; this sprint's console/error-panel-related work was the summary-line update above -- no separate rebuild was needed since both already met their requirements.
- **This completes every Compiler Workspace visualization panel in PRD.md §8.** Only Sprint 8 remains for v1: Project management, Grammar Library, History, Reports, Settings, and Help.
- No new dependencies this sprint.
- `npm run build` passes with zero TypeScript errors and no bundle-size warnings.

### Sprint 7 Definition of Done — Checklist
- [x] Code builds with zero TypeScript errors
- [x] No console errors/warnings in dev mode
- [x] Verified against both mock fixtures (success shows 4 assembly lines including the folded-constant comment; semantic failure correctly shows the "didn't reach code generation" empty state)
- [x] Mock data wired through the existing service layer, not hardcoded in components
- [x] `CHANGELOG.md` updated
- [ ] Explicit approval from Karan before Sprint 8 starts

---

## [Sprint 6] — Semantic Report + TAC + Optimization Comparison

**Date:** 2026-07-25
**Status:** ✅ Complete — pending Karan's review/approval before Sprint 7

### Added
- `SemanticReportView` — scoped strictly to semantic-phase diagnostics (distinct from the general Diagnostics tab, which shows all phases), plus a scope-by-scope symbol summary grouped from the symbol table; clearly distinguishes "semantic analysis passed," "semantic analysis found issues," and "semantic analysis never ran because an earlier phase failed"
- `TACViewer` — Three Address Code table (op/arg1/arg2/result) via the shared `DataTable` primitive
- `OptimizationComparisonView` — before/after instruction lists (stacked, since the output panel is narrow), passes-applied badges, and an instruction-count reduction summary
- Three new Workspace tabs: Semantic Report, TAC, Optimization — bringing the tab bar to 9 tabs total
- Tab bar changed from equal-width (`flex-1`) to horizontally scrollable, auto-width tabs — 9 tab labels (including "Semantic Report") no longer fit an equal-width layout in the ~380–560px output panel

### Notes
- No new dependencies this sprint — all three new views reuse existing primitives (`DataTable`, `Card`, `Badge`).
- `npm run build` passes with zero TypeScript errors and no bundle-size warnings.

### Sprint 6 Definition of Done — Checklist
- [x] Code builds with zero TypeScript errors
- [x] No console errors/warnings in dev mode
- [x] Verified against both mock fixtures (success shows the constant-folding pass and a 3→2 instruction reduction; semantic failure correctly shows "semantic analysis found issues" with the undeclared-variable diagnostic)
- [x] Mock data wired through the existing service layer, not hardcoded in components
- [x] `CHANGELOG.md` updated
- [ ] Explicit approval from Karan before Sprint 7 starts

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
