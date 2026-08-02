# SmartCC — Intelligent Mini Compiler & Interactive Compiler Visualizer

A web-based educational compiler that visualizes every phase of compiler design -- lexical analysis through target code generation -- in one interactive pipeline.

> **Current phase: v1 -- Frontend only, mock-data driven.** See `Phases.md` for the full roadmap and `Architecture.md`/`SystemDesign.md` for how the mock layer is designed to swap cleanly for a real FastAPI backend later.

---

## Documentation

All product/engineering docs live at the repo root:

| Doc | Purpose |
|---|---|
| `PRD.md` | Product requirements, scope, users |
| `Architecture.md` | Frontend architecture, folder structure, data flow |
| `SystemDesign.md` | Compiler module responsibilities, shared data models |
| `Design.md` | Color/type/spacing/motion design tokens |
| `Rules.md` | Coding standards, AI-assisted dev boundaries, error handling |
| `Phases.md` | v1->v4 roadmap and sprint sequencing |
| `API-spec.md` | Forward-looking backend contract (v2+) |
| `Security.md` | Security posture, secrets management, threat model |
| `Testing.md` | Test pyramid, per-algorithm correctness testing, CI |
| `Memory.md` | Forward-looking AI Engine memory architecture (v4) |

---

## Tech Stack (v1)

React 19 - TypeScript (strict) - Vite - Tailwind CSS v4 - Framer Motion - React Router - lucide-react

---

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Open the printed local URL. The app runs entirely on mock JSON fixtures (`src/features/*/mocks/`) -- no backend required.

### Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and produce a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint |

---

## Project Structure

Feature-based architecture -- see `Architecture.md` Section 3 for the authoritative layout. Summary:

```
src/
├── app/           # Router, providers, app bootstrap
├── layouts/       # AppShell, Sidebar, Topbar
├── pages/         # Thin route-level containers
├── features/      # compiler-workspace, dashboard, grammar-library, history, reports
├── components/    # Cross-feature reusable UI (ui/, charts/, data-table/, feedback/)
├── services/      # compilerService (backend-ready contract) + mockAdapter
├── types/         # Shared TypeScript models (compiler.ts -- single source of truth)
├── hooks/, lib/, styles/
```

---

## Sprint Status

Tracking per `Phases.md` Section 2 (v1):

- [x] Sprint 1 -- App shell, routing, layout, design system foundation
- [x] Sprint 2 -- Dashboard
- [x] Sprint 3 -- Compiler Workspace shell (editor + pipeline stepper)
- [x] Sprint 4 -- Token Viewer + Symbol Table
- [x] Sprint 5 -- Parse Tree visualization
- [ ] Sprint 6 -- Semantic Report + TAC + Optimization Comparison
- [ ] Sprint 7 -- Assembly Viewer + Console + Error Panel
- [ ] Sprint 8 -- Grammar Library, History, Reports, Settings, Help

See `CHANGELOG.md` for detailed per-sprint entries.

---

## License

MIT -- see `LICENSE`.
