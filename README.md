<div align="center">

# 🧠 SmartCC
### Intelligent Mini Compiler & Interactive Compiler Visualizer

**Watch your code become assembly — one phase at a time.**

[![Frontend](https://img.shields.io/badge/frontend-React%2019%20%2B%20TypeScript-5E6AD2?style=for-the-badge&logo=react&logoColor=white)](./frontend)
[![Backend](https://img.shields.io/badge/backend-FastAPI%20%2B%20Python-3FB950?style=for-the-badge&logo=fastapi&logoColor=white)](./backend)
[![License](https://img.shields.io/badge/license-MIT-58A6FF?style=for-the-badge)](./LICENSE)
[![Status](https://img.shields.io/badge/v1%20Frontend-Complete-3FB950?style=for-the-badge)](./CHANGELOG.md)
[![Status](https://img.shields.io/badge/v2%20Backend-Complete-3FB950?style=for-the-badge)](./CHANGELOG.md)

[![Tests](https://img.shields.io/badge/backend%20tests-64%2F64%20passing-3FB950?style=flat-square)](./backend/tests)
[![Lint](https://img.shields.io/badge/lint-0%20warnings-3FB950?style=flat-square)](./frontend)
[![Build](https://img.shields.io/badge/build-passing-3FB950?style=flat-square)](./frontend)

</div>

---

## ✨ What is this?

Compiler Design is usually taught through disconnected experiments — a lexer here, a parser there, never a full picture of how source code *actually* becomes machine instructions.

**SmartCC fixes that.** Write C-like code in a VS Code–style editor, hit compile, and watch it flow through a **real, working 6-phase compiler** — visualized live.

```mermaid
flowchart LR
    A["📝 Source Code"] --> B["🔤 Lexer"]
    B --> C["🌳 Parser"]
    C --> D["🔍 Semantic<br/>Analyzer"]
    D --> E["⚙️ TAC<br/>Generator"]
    E --> F["⚡ Optimizer"]
    F --> G["🖥️ Codegen"]
    G --> H["✅ Assembly"]

    style A fill:#131316,stroke:#5E6AD2,color:#EDEDEF
    style B fill:#131316,stroke:#58A6FF,color:#EDEDEF
    style C fill:#131316,stroke:#BC8CFF,color:#EDEDEF
    style D fill:#131316,stroke:#D29922,color:#EDEDEF
    style E fill:#131316,stroke:#3FB950,color:#EDEDEF
    style F fill:#131316,stroke:#F778BA,color:#EDEDEF
    style G fill:#131316,stroke:#F85149,color:#EDEDEF
    style H fill:#131316,stroke:#3FB950,color:#EDEDEF
```

Every box above is **real** — not a simulation. Lexical errors, syntax errors, undeclared variables, constant folding, and generated assembly all come from genuine compiler logic (PLY-based lexer/parser + hand-written semantic analysis, optimizer, and codegen).

---

## 📚 Table of Contents

- [Documentation](#-documentation)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [How It's Built](#-how-its-built)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 📖 Documentation

| Doc | What's inside |
|---|---|
| 📋 [`PRD.md`](./PRD.md) | Product requirements, scope, target users |
| 🏗️ [`Architecture.md`](./Architecture.md) | Frontend architecture, folder structure, data flow |
| 🧩 [`SystemDesign.md`](./SystemDesign.md) | Compiler module responsibilities, shared data models |
| 🎨 [`Design.md`](./Design.md) | Color palette, typography, spacing, motion tokens |
| 📏 [`Rules.md`](./Rules.md) | Coding standards, AI-assisted dev boundaries |
| 🗺️ [`Phases.md`](./Phases.md) | v1 → v4 roadmap and sprint sequencing |
| 🔌 [`API-spec.md`](./API-spec.md) | Backend API contract (implemented in `backend/`) |
| 🔒 [`Security.md`](./Security.md) | Security posture, secrets management, threat model |
| 🧪 [`Testing.md`](./Testing.md) | Test pyramid, correctness testing, CI |
| 🧠 [`Memory.md`](./Memory.md) | Forward-looking AI Engine memory architecture (v4) |
| 📝 [`CHANGELOG.md`](./CHANGELOG.md) | Every sprint, what shipped, what broke, what got fixed |

---

## 🚀 Quick Start

> This is a **monorepo** — `frontend/` and `backend/` run independently. Docs live at this root.

### 1. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

➡️ Open **http://localhost:5173**

Runs on realistic mock data by default (`VITE_USE_MOCK=true`) — **no backend required.**

### 2. Backend (optional — for the real compiler)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

➡️ Open **http://localhost:8000/docs** for interactive API docs

### 3. Connect them

Set `VITE_USE_MOCK=false` in `frontend/.env` (backend must be running) — the UI now runs on the **real compiler**, not fixtures.

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as ⚛️ Frontend (React)
    participant B as 🐍 Backend (FastAPI)
    participant C as 🧠 Compiler Engine

    U->>F: Writes code, clicks Compile
    F->>B: POST /api/v1/compile
    B->>C: tokenize() → parse() → analyze()
    C->>C: generate_tac() → optimize() → codegen()
    C-->>B: CompilationResult
    B-->>F: JSON response
    F-->>U: Tokens, AST, TAC, Assembly — all live
```

---

## 🛠 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

- **Zustand** — state management
- **TanStack Table** — data grids
- **React Flow** — parse tree visualization
- **Recharts** — dashboard charts
- **Framer Motion** — animations
- **Monaco Editor** — code editing

</td>
<td valign="top" width="50%">

### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat-square&logo=pydantic&logoColor=white)

- **PLY** — real Lexer + Parser (lex/yacc)
- **Pytest** — 64 automated tests
- **Ruff** — linting

</td>
</tr>
</table>

---

## 🧬 How It's Built

Every phase below is **genuinely implemented** — verified against programs that never appeared in any test or fixture.

```mermaid
graph TD
    subgraph Backend["🐍 backend/app/compiler/"]
        L["lexer/<br/>PLY-based tokenizer"]
        P["parser/<br/>PLY yacc, real AST"]
        S["semantic/<br/>scope + type checks"]
        O["optimizer/<br/>TAC gen + constant folding"]
        CG["codegen/<br/>x86-style assembly"]
    end
    L --> P --> S --> O --> CG
```

| Phase | What it really does |
|---|---|
| 🔤 **Lexer** | Tokenizes keywords, identifiers, operators, comments — detects real illegal-character errors |
| 🌳 **Parser** | Builds a real AST with correct operator precedence (`2 + 3 * 4` ≠ `(2+3)*4`) |
| 🔍 **Semantic Analyzer** | Catches undeclared variables, duplicate declarations, unused-variable warnings |
| ⚙️ **TAC Generator** | Emits real Three-Address Code from the AST |
| ⚡ **Optimizer** | Constant folding + propagation — `x=5; return x+2;` → `return 7;` |
| 🖥️ **Codegen** | Emits simplified x86-style assembly from optimized TAC |

---

## 📁 Project Structure

```
smartcc/
├── 🖥️  frontend/            React + TypeScript app
│   └── src/
│       ├── app/            Router, providers
│       ├── layouts/        Shell, Sidebar, Topbar
│       ├── pages/          Route-level containers
│       ├── features/       compiler-workspace, dashboard, projects...
│       ├── components/     Shared UI (ui/, charts/, data-table/)
│       ├── services/       compilerService, mockAdapter, httpAdapter
│       └── types/          Shared TypeScript models
│
├── 🐍 backend/              FastAPI app
│   └── app/
│       ├── main.py         CORS + router registration
│       ├── models/         Pydantic schemas
│       ├── routers/        /compile, /grammar, /history
│       └── compiler/       lexer/ parser/ semantic/ optimizer/ codegen/
│
└── 📄 *.md                  Engineering docs (this level)
```

---

## 🗺 Roadmap

```mermaid
gantt
    dateFormat  YYYY-MM-DD
    title SmartCC Development Timeline
    section v1 — Frontend
    Sprints 1-8 (Complete)     :done, v1, 2026-07-22, 8d
    section v2 — Real Backend
    Sprints 9-15 (Complete)    :done, v2, 2026-08-01, 27d
    section v3 — Persistence
    Planning                   :v3, after v2, 5d
```

<table>
<tr><td>✅</td><td><b>v1 — Frontend</b></td><td>All 8 sprints complete. Every page functional on mock data.</td></tr>
<tr><td>✅</td><td><b>v2 — Real Backend</b></td><td>All 7 sprints complete. Real 6-phase compiler, connected end-to-end to the frontend.</td></tr>
<tr><td>⏳</td><td><b>v3 — Persistence</b></td><td>Not started. Scope to be confirmed before kickoff (per <code>Phases.md</code> re-baseline rule).</td></tr>
</table>

<details>
<summary><b>📜 Full v2 sprint history</b> (click to expand)</summary>

| Sprint | Delivered |
|---|---|
| 9 | FastAPI scaffold + `/compile`, `/grammar`, `/history` endpoints (stub pipeline) |
| 10 | Real Lexer (PLY) — genuine tokenization + lexical-error detection |
| 11 | Real Parser → AST — precedence-climbing expressions, real syntax errors |
| 12 | Real Semantic Analyzer — undeclared/duplicate detection, unused-variable warnings |
| 13 | Real TAC generation + Optimizer — constant folding, verified on novel programs |
| 14 | Real target codegen — **all 6 phases complete**, verified end-to-end |
| 15 | Frontend `httpAdapter` — real integration, CORS verified, mock/real toggle |

Full detail on every sprint (including bugs found and fixed) is in [`CHANGELOG.md`](./CHANGELOG.md).

</details>

---

## 📄 License

MIT — see [`LICENSE`](./LICENSE).

<div align="center">

**Built by Karan Daiya** · A portfolio project demonstrating full-stack engineering + compiler theory

</div>
