<div align="center">

# 🧪 Testing Strategy & CI
## SmartCC

![Backend Tests](https://img.shields.io/badge/backend-64%2F64%20passing-3FB950?style=flat-square)
![Frontend Lint](https://img.shields.io/badge/frontend%20lint-0%20warnings-3FB950?style=flat-square)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

</div>

---

## 🔺 1. Test Pyramid

```mermaid
graph TD
    E2E["🌐 E2E — Few<br/>Critical user flows (Playwright)"]
    INT["🔗 Integration — Moderate<br/>Service + component (RTL)"]
    UNIT["🧱 Unit Tests — Many<br/>Pure functions, per-algorithm correctness"]

    E2E --> INT --> UNIT

    style E2E fill:#131316,stroke:#F85149,color:#EDEDEF
    style INT fill:#131316,stroke:#D29922,color:#EDEDEF
    style UNIT fill:#131316,stroke:#3FB950,color:#EDEDEF
```

> 🎯 **Principle:** compiler-correctness logic (lexer, parser, optimizer) gets the heaviest investment — a beautiful UI wrapping a wrong compiler defeats the whole purpose.

---

## 🧱 2. Unit Testing

### 2.1 Frontend

| Target | What's tested |
|---|---|
| 🔌 `compilerService` | Correctly typed `CompilationResult`; error states surface correctly |
| 🛠️ Pure utilities | Formatting, diffing, tree flattening |
| 🪝 Hooks (`useCompile`) | State transitions: idle → loading → success/error |
| 🧩 Components | Rendering with representative prop combinations |

### 2.2 Per-Algorithm Correctness Testing (Backend) — ✅ Real, Not Aspirational

```mermaid
graph LR
    L["🔤 Lexer<br/>11 tests"] --> P["🌳 Parser<br/>10 tests"]
    P --> S["🔍 Semantic<br/>9 tests"]
    S --> T["⚙️ TAC<br/>8 tests"]
    T --> O["⚡ Optimizer<br/>8 tests"]
    O --> C["🖥️ Codegen<br/>6 tests"]
    C --> EP["🌐 Endpoints<br/>11 tests"]

    style L fill:#131316,stroke:#58A6FF,color:#EDEDEF
    style P fill:#131316,stroke:#BC8CFF,color:#EDEDEF
    style S fill:#131316,stroke:#D29922,color:#EDEDEF
    style T fill:#131316,stroke:#3FB950,color:#EDEDEF
    style O fill:#131316,stroke:#F778BA,color:#EDEDEF
    style C fill:#131316,stroke:#F85149,color:#EDEDEF
    style EP fill:#131316,stroke:#5E6AD2,color:#EDEDEF
```

| Module | Test Approach | Count |
|---|---|:---:|
| 🔤 **Lexer** | Table-driven: source → exact token list. Covers comments, multi-char operators (`==`, `<=`) | `11` ✅ |
| 🌳 **Parser** | Token stream → exact AST shape + operator precedence + syntax errors | `10` ✅ |
| 🔍 **Semantic** | AST → symbol table + diagnostics (undeclared var, duplicate decl, scope) | `9` ✅ |
| ⚙️ **TAC Generator** | AST → exact TAC sequence, including precedence-correct chaining | `8` ✅ |
| ⚡ **Optimizer** | TAC → hand-verified optimized output (constant folding + edge cases like ÷0) | `8` ✅ |
| 🖥️ **Codegen** | Optimized TAC → exact assembly output | `6` ✅ |
| 🌐 **Endpoints** | Full request/response contract via `TestClient` | `11` ✅ |

<div align="center">

**Total: 64/64 passing** — every fixture derived from manually verified compilation traces, never assumed.

</div>

---

## 🔗 3. Integration Testing

- 🧪 Compiler Workspace: source → service call → all panels update consistently
- 🚨 Error Panel correctly filters/groups diagnostics by phase
- 📊 Dashboard: stats/charts render correctly from fixtures

---

## 🌐 4. End-to-End Testing (Playwright) — Critical Flows Only

```mermaid
flowchart LR
    A["1️⃣ Load app → Workspace<br/>→ type → Compile"] --> B["2️⃣ Syntax error →<br/>verify phase-tagged message"]
    B --> C["3️⃣ Dashboard → Projects<br/>→ open → Workspace loads"]
```

> Not exhaustive by design — 3–5 critical flows, not every page.

---

## ⚙️ 5. CI Pipeline (GitHub Actions)

✅ **Implemented** — see [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

```mermaid
graph TB
    Push["📤 push / PR"] --> FE["🖥️ frontend-checks<br/>tsc + oxlint + build"]
    Push --> BE["🐍 backend-checks<br/>ruff + pytest"]
    FE --> Merge{"✅ All green?"}
    BE --> Merge
    Merge -->|Yes| Ship["🚀 Mergeable"]
    Merge -->|No| Block["🛑 Blocked"]

    style Ship fill:#131316,stroke:#3FB950,color:#EDEDEF
    style Block fill:#131316,stroke:#F85149,color:#EDEDEF
```

> 🛑 **Rule:** no merge if `typecheck`, `lint`, or `test` fail. A broken build is worse than no CI at all.

---

## 📊 6. Coverage Expectations

| Layer | Target | Actual | Reasoning |
|---|:---:|:---:|---|
| 🧠 Compiler algorithms | ~85%+ | ✅ High | Correctness-critical core |
| 🔌 Service layer / adapters | ~80%+ | ✅ High | Contract correctness for mock↔real swap |
| 🧩 UI components | ~50-60% | Moderate | Logic-bearing components prioritized |
| 🌐 E2E | Low count, high value | Not yet built | 3-5 flows planned, not exhaustive |

> 📌 **Rule:** coverage % is never the goal itself — an 85%-covered optimizer pass beats a 100%-covered trivial component.
