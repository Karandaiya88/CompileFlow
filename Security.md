# Security.md
## SmartCC — Security Model & Threat Considerations

| Field | Value |
|---|---|
| Version | 1.0 |
| Scope Note | Proportionate to a solo-built educational tool, not an enterprise system. Sections marked "v3+" are forward-looking. |

---

## 1. Security Posture Summary

SmartCC is a single-developer educational project. The security model is intentionally scoped to be **realistic for the project's size** — not a copy-pasted enterprise threat model. The goal is: no leaked secrets, no obviously exploitable input handling, and a clear upgrade path if the project ever needs real multi-user auth.

---

## 2. Secrets Management

**Binding rule, non-negotiable, based on a past real incident:** a Groq API key was previously committed to a public GitHub repo during the ARIC project and had to be rotated. That does not happen again on SmartCC.

1. All secrets (API keys, DB credentials, JWT signing keys) live in `.env` files only.
2. `.env` is listed in `.gitignore` from the **first commit** of the repository — verified before any code is pushed, not after.
3. `.env.example` (with placeholder values only) is committed instead, so the setup process is documented without exposing real values.
4. No secret is ever hardcoded in source, mock fixtures, or committed config files — including "temporary for testing" hardcoding, which is how leaks usually happen.
5. If a secret is ever accidentally committed: rotate immediately, then scrub git history (`git filter-repo` or BFG), not just delete-and-recommit.

---

## 3. Authentication & Authorization

### v1–v2 (Current & Near-Term)
- No authentication required — single-user, local/demo usage only. No user data, no PII collected.

### v3+ (Forward-Looking — Persistence & Multi-Project)
- **Auth mechanism:** JWT-based session tokens issued by FastAPI backend.
- **Password storage:** bcrypt/argon2 hashing, never plaintext, never reversible encryption.
- **Token lifecycle:** short-lived access token + refresh token pattern; access tokens expire in 15–30 min.

### RBAC (Role-Based Access Control) — v3+ Design

| Role | Permissions |
|---|---|
| `student` (default) | Create/edit/delete own projects; run compilations; view own history |
| `faculty` | All student permissions + view aggregate/anonymized class-level reports (if institutional deployment is ever pursued) |
| `admin` | User management, grammar library management |

> RBAC is deliberately simple (3 roles) — this is an educational tool, not a system requiring fine-grained permission matrices. Over-engineering RBAC here would be a red flag in a portfolio review, not a strength.

---

## 4. Input Handling & Threat Model

SmartCC's main "attack surface" is **user-submitted source code** sent to `/compile`. This is treated seriously even though it's an educational tool, because arbitrary text input to a parser is a classic injection/DoS vector.

| Threat | Mitigation |
|---|---|
| **Malicious/pathological input** causing infinite loops or excessive recursion in the lexer/parser | Hard execution timeout on `/compile` (see API-spec.md §7 `COMPILATION_TIMEOUT`); max input length enforced (e.g., 50,000 characters) |
| **Resource exhaustion (DoS)** via repeated large compile requests | Rate limiting per IP/session on `/compile` (v2+, e.g., 20 requests/minute) |
| **Code injection via mock/real backend** (e.g., source code somehow reaching a shell/eval context) | The compiler pipeline never executes submitted code — it only lexes/parses/analyzes it. No `eval()`, no subprocess execution of user input, ever |
| **XSS via rendered diagnostics/token values** | All user-supplied strings (identifiers, literals) rendered in React are auto-escaped by default; no `dangerouslySetInnerHTML` used anywhere in the Workspace |
| **SQL injection** (v3+, once PostgreSQL is introduced) | SQLAlchemy ORM with parameterized queries exclusively; no raw string-interpolated SQL |
| **CORS misconfiguration** (v2+, once frontend/backend are separate origins) | Explicit allow-list of origins in FastAPI CORS middleware; no wildcard `*` in production |

---

## 5. Data Sensitivity Classification

| Data | Sensitivity | Notes |
|---|---|---|
| Submitted source code | Low | Educational snippets, not proprietary/confidential by design assumption |
| User account info (v3+) | Medium | Email + hashed password only; no unnecessary PII collected |
| Compilation history (v3+) | Low | Tied to user, not shared unless explicitly exported |

No payment data, no sensitive PII, no health/financial data anywhere in scope — this keeps the threat model proportionate.

---

## 6. Dependency & Supply Chain Hygiene

- `npm audit` / `pip-audit` run before each version milestone (v1, v2, v3, v4), not just ad hoc.
- No dependency added without checking maintenance status (last publish date, open critical CVEs) — applies especially to any PLY/parser-adjacent packages given they touch untrusted input.

---

## 7. What This Project Deliberately Does NOT Do (and why that's fine)

- No penetration testing program — disproportionate for a solo educational tool.
- No SOC2/compliance documentation — not applicable at this scale.
- No enterprise SSO/SAML — RBAC via simple JWT roles is sufficient for the stated use case.

If SmartCC is ever adopted institutionally at real scale, this document is the first one to revisit and expand — not a reason to over-build now.
