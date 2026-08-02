# Rules.md
## SmartCC — Development Rules & Conventions

| Field | Value |
|---|---|
| Version | 1.0 |
| Applies To | All sprints, all contributors (including AI-assisted development) |

---

## 1. Purpose

This document is the binding rulebook for how SmartCC is built. It exists so that every sprint — whether coded by hand or with AI assistance (Claude) — produces consistent, predictable, production-grade output. When in doubt, this file wins over convenience.

---

## 2. Coding Standards

### 2.1 TypeScript
- `strict: true` always. No `any` without a written justification comment (`// any: reason`).
- Prefer `interface` for object shapes, `type` for unions/aliases.
- No implicit return types on exported functions — always annotate.
- Enums avoided in favor of union string literal types (`"error" | "warning"`) for better tree-shaking and serialization.

### 2.2 React
- Functional components only. No class components.
- One component per file; file name matches component name (`TokenViewer.tsx` → `TokenViewer`).
- Props interfaces named `<Component>Props` and defined directly above the component.
- No inline business logic in JSX — extract to hooks or utils.
- Avoid prop drilling beyond 2 levels; use Zustand store or Context instead.

### 2.3 Naming Conventions
| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `ParseTreeView.tsx` |
| Hooks | camelCase, `use` prefix | `useCompile.ts` |
| Types/Interfaces | PascalCase | `CompilationResult` |
| Files (non-component) | camelCase | `compilerService.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_TOKEN_PREVIEW` |
| Folders | kebab-case | `compiler-workspace/` |

### 2.4 Styling
- Tailwind utility classes only — no separate CSS files unless a Tailwind utility genuinely cannot express the requirement.
- No inline `style={{}}` except for computed/dynamic values (e.g., dynamic width from resize).
- Design tokens (colors, spacing) always pulled from `tailwind.config.ts`, never hardcoded hex values in components.

### 2.5 Imports
- Absolute imports via path aliases (`@/features/...`, `@/components/...`) — no deep relative paths (`../../../`).
- Group order: external libs → internal aliases → relative → styles.

---

## 3. Folder & Feature Boundaries

- A feature module (`features/compiler-workspace/`) must not import directly from another feature module's internals. Cross-feature sharing goes through `components/`, `hooks/`, or `services/` (global layers).
- Mock data lives inside the feature that owns it (`features/compiler-workspace/mocks/`), never in a global dumping ground.

---

## 4. Error Handling Conventions

1. **Every async operation** (compile, fetch grammar, fetch history) must handle three states explicitly: `loading`, `error`, `success`. No silent failures.
2. **User-facing errors** are always human-readable and phase-tagged where applicable (see SystemDesign.md §5) — never raw stack traces or JSON dumps shown to the user.
3. **Developer-facing errors** (console) may be verbose; user-facing errors (UI) must be concise and actionable.
4. Global `<ErrorBoundary>` wraps the app shell to catch unhandled render errors — this is a safety net, not a substitute for local handling.
5. Mock adapter failures (simulated) must be distinguishable from real logic errors during development — use a distinct error type (`MockAdapterError`) for this.

---

## 5. AI-Assisted Development Boundaries

Since this project is built with Claude's help, these rules keep the collaboration disciplined:

1. **Sprint-by-sprint only.** Claude does not generate the entire app, an entire feature module, or more than one sprint's worth of code in a single pass, even if asked to "just finish it" — unless Karan explicitly overrides this rule for a specific case.
2. **No silent scope expansion.** If a task implies backend, database, or auth work while still in frontend-only phase, Claude flags it rather than building it.
3. **Explain before generating.** For any non-trivial architectural choice (state management tool, library choice), Claude states the reasoning briefly before/with the code — not just a code dump.
4. **Approval gates are real.** After each sprint, Claude stops and waits for explicit sign-off before starting the next sprint (see Phases.md).
5. **Mock data must be realistic**, not lorem-ipsum placeholders — derived from actual traced compiler behavior on sample programs (see SystemDesign.md §6).
6. **No unexplained dependencies.** Any new npm package introduced must be justified (what it does, why an alternative wasn't chosen).

---

## 6. Git & Commit Conventions

Even as a solo project, commit hygiene matters for portfolio credibility:

```
<type>(<scope>): <short summary>

feat(workspace): add resizable sidebar to compiler workspace
fix(token-viewer): correct column offset in token table
docs(architecture): update sprint breakdown after review
chore(deps): add react-flow for parse tree visualization
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

---

## 7. Definition of "Done" (Per Sprint)

A sprint is considered complete only when:
- [ ] Code builds with zero TypeScript errors
- [ ] No console errors/warnings in dev mode
- [ ] Component(s) responsive at 360px, 768px, 1440px
- [ ] Mock data wired through the service layer (not hardcoded in components)
- [ ] CHANGELOG.md updated with the sprint's entries
- [ ] Explicit approval given by Karan before next sprint starts
