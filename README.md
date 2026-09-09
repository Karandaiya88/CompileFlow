# SmartCC — Intelligent Mini Compiler & Interactive Compiler Visualizer

A web-based educational compiler that visualizes every phase of compiler design -- lexical analysis through target code generation -- in one interactive pipeline.

> **v2 complete — the frontend now genuinely talks to the real backend.** Set `VITE_USE_MOCK=false` in `frontend/.env` (with the backend running) to see the actual compiler power the UI end-to-end. Default remains mock (`VITE_USE_MOCK=true`), so `npm run dev` still works standalone with zero backend setup. See `Phases.md` for what v3 might look like next -- not started without confirming scope first.

This is a **monorepo**: `frontend/` and `backend/` are independent, separately-run projects sharing the docs at this root.

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
| `API-spec.md` | Backend API contract -- now implemented by `backend/`, see Sprint 9 |
| `Security.md` | Security posture, secrets management, threat model |
| `Testing.md` | Test pyramid, per-algorithm correctness testing, CI |
| `Memory.md` | Forward-looking AI Engine memory architecture (v4) |

---

## Getting Started

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs on mock JSON fixtures by default (`VITE_USE_MOCK=true` in `.env`) -- no backend required. Set `VITE_USE_MOCK=false` (with the backend running, see below) to use the real compiler instead.

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs. See `backend/README.md` for details.

---

## Tech Stack

**Frontend (v1, complete):** React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · Framer Motion · React Router · Zustand · TanStack Table · React Flow · Recharts

**Backend (v2, in progress):** FastAPI · Python · Pydantic · (PLY arrives with the real lexer, Sprint 10)

---

## Project Structure

```
smartcc/
├── frontend/          # React app -- see Architecture.md for the authoritative layout
│   └── src/
│       ├── app/ layouts/ pages/ features/ components/ services/ types/
├── backend/            # FastAPI app -- see backend/README.md
│   └── app/
│       ├── main.py models/ routers/ compiler/
├── PRD.md, Architecture.md, SystemDesign.md, ...   # docs (this level)
```

---

## Roadmap Status

**v1 (Frontend) -- ✅ Complete.** All 8 sprints done, every page functional on mock data. See `CHANGELOG.md`.

**v2 (Real Backend) -- 🚧 In progress:**

- [x] Sprint 9 -- FastAPI scaffold + `/compile`, `/grammar`, `/history` endpoint skeletons (stub pipeline, real HTTP contract)
- [x] Sprint 10 -- Real Lexer (PLY) -- genuine tokenization + lexical-error detection on arbitrary input
- [x] Sprint 11 -- Real Parser → AST -- precedence-climbing expression grammar, real syntax-error detection
- [x] Sprint 12 -- Real Semantic Analyzer -- undeclared/duplicate detection works for any identifier, unused-variable warnings
- [x] Sprint 13 -- Real TAC generation + Optimizer -- constant folding verified against a novel 2-variable program
- [x] Sprint 14 -- Real target codegen -- ALL 6 real compiler phases now complete, verified end-to-end on a novel program
- [x] Sprint 15 -- Frontend `mockAdapter` → `httpAdapter` swap -- verified end-to-end against a live server, including CORS

See `CHANGELOG.md` for detailed per-sprint entries and `Phases.md` for the full v1-v4 roadmap.

---

## License

MIT -- see `LICENSE`.
