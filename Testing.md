# Testing.md
## SmartCC — Testing Strategy & CI

| Field | Value |
|---|---|
| Version | 1.0 |
| Applies To | v1 (frontend/mock) now; extends to v2 backend algorithms |

---

## 1. Test Pyramid

```
                    ▲
                   ╱ ╲
                  ╱ E2E╲          Few — critical user flows only
                 ╱───────╲        (Playwright)
                ╱          ╲
               ╱ Integration╲     Moderate — service layer + component
              ╱───────────────╲   integration (React Testing Library)
             ╱                  ╲
            ╱   Unit Tests        ╲  Many — pure functions, hooks,
           ╱───────────────────────╲ per-algorithm correctness (Vitest)
```

**Principle:** the compiler-correctness logic (lexer rules, parser grammar, optimization passes) gets the heaviest unit-test investment, since correctness there is the entire point of the product — a beautiful UI wrapping a wrong compiler defeats the purpose.

---

## 2. Unit Testing (Vitest)

### 2.1 Frontend (v1 — Current Phase)

| Target | What's tested |
|---|---|
| `compilerService` (mock adapter) | Returns correctly typed `CompilationResult` for each fixture; error states surface correctly |
| Pure utility functions (`lib/`) | Formatting, diffing (for Optimization Comparison), tree flattening (for Parse Tree) |
| Hooks (`useCompile`, `usePipelineState`) | State transitions: idle → loading → success/error |
| Components (isolated) | Rendering with representative prop combinations — e.g., `TokenViewer` renders correctly with 0 tokens, 1 token, 500 tokens (performance/virtualization check) |

### 2.2 Per-Algorithm Correctness Testing (v2 — Real Backend)

This is the most important testing category once the real compiler engine exists. Each phase is tested **in isolation**, against known-correct input/output pairs, independent of the UI:

| Module | Test Approach |
|---|---|
| **Lexer** | Table-driven tests: given source string → expect exact token list (type, value, line, column). Cover edge cases: comments, string literals with escapes, multi-char operators (`==`, `!=`, `<=`). |
| **Parser** | Given token stream → expect exact AST shape. Include invalid-grammar cases and assert the correct syntax error is raised (not just "an error"). |
| **Semantic Analyzer** | Given AST → expect correct symbol table entries and diagnostics. Cover: undeclared variable, type mismatch, duplicate declaration, scope shadowing. |
| **IR Generator** | Given AST → expect exact TAC instruction sequence for known constructs (if/else, loops, expressions with precedence). |
| **Optimizer** | Given TAC → expect optimized TAC matching hand-verified "correct" optimization output per pass (constant folding, dead code elimination tested independently, then in combination). |
| **Codegen** | Given optimized TAC → expect exact assembly-like output for a fixed instruction set. |

> Every algorithm test fixture is derived from **manually verified compilation traces** (same principle as SystemDesign.md §6 mock data strategy) — never assumed or auto-generated without verification.

---

## 3. Integration Testing (React Testing Library)

- Compiler Workspace: submitting source code through the editor → mock service call → all panels (Token Viewer, Symbol Table, Parse Tree, etc.) update with consistent, matching data.
- Error Panel correctly filters and groups diagnostics by phase when a mock "failure" fixture is used.
- Dashboard: stats cards and charts render correctly from `dashboardStats.json`.

---

## 4. End-to-End Testing (Playwright) — Critical Flows Only

E2E tests are expensive to maintain, so they're reserved for the flows that matter most for a demo/interview scenario:

1. Load app → navigate to Compiler Workspace → type sample program → click Compile → verify all panels populate.
2. Submit a program with a known syntax error → verify Error Panel shows the correct phase-tagged message.
3. Navigate Dashboard → Projects → open a project → Workspace loads with that project's context.

No exhaustive E2E coverage of every page — that's what unit/integration tests are for.

---

## 5. CI Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml (conceptual outline)
on: [push, pull_request]

jobs:
  frontend-checks:
    steps:
      - install dependencies
      - typecheck (tsc --noEmit)
      - lint (eslint)
      - unit + integration tests (vitest)
      - build (vite build) — must succeed with zero errors

  e2e:
    needs: frontend-checks
    steps:
      - run Playwright suite against a preview build

  backend-checks (v2+):
    steps:
      - install Python dependencies
      - lint (ruff/flake8)
      - per-algorithm correctness tests (pytest)
      - typecheck (mypy, if adopted)
```

**Rule:** no merge to `main` if `typecheck`, `lint`, or `test` fail. `build` failing is a hard blocker — a portfolio project with a broken build is worse than no CI at all.

---

## 6. Coverage Expectations (Realistic, Not Vanity Metrics)

| Layer | Target Coverage | Reasoning |
|---|---|---|
| Compiler algorithms (Lexer/Parser/Semantic/IR/Optimizer/Codegen) | High (~85%+) | This is the correctness-critical core |
| Service layer / adapters | High (~80%+) | Contract correctness matters for the mock→real swap |
| UI components | Moderate (~50–60%) | Focus on logic-bearing components, not every presentational div |
| E2E | Low count, high value | 3–5 critical flows, not exhaustive |

**Rule:** coverage percentage is never the goal itself — a 100%-covered trivial component is worth less than an 85%-covered optimizer pass. Prioritize by correctness-criticality, not by ease of hitting a number.
