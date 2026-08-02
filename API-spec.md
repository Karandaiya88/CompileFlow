# API-spec.md
## SmartCC — API Contract Specification

| Field | Value |
|---|---|
| Version | 1.0 |
| Status | **Forward-looking blueprint — not yet implemented.** Current v1 phase uses mock JSON only (see Architecture.md §4.2). This spec is authored now so the mock adapter's shape is contractually identical to the future real backend. |
| Applies From | v2 (see Phases.md §3) |

---

## 1. Purpose

This document defines the exact REST contract the FastAPI backend must implement in v2. Writing it now — while still on mock data — ensures the frontend's `CompilerService` interface (Architecture.md §4.2) never has to change shape later; only the adapter swaps.

---

## 2. Base Conventions

- Base URL (dev): `http://localhost:8000/api/v1`
- Format: JSON only, `Content-Type: application/json`
- Auth: Bearer token in `Authorization` header (v3+, see Security.md — not required in v2's initial single-user mode)
- Errors: consistent envelope (see §7)

---

## 3. Endpoint: Compile Source Code

### `POST /compile`

Runs the full compiler pipeline on submitted source code and returns a `CompilationResult` matching the shared type defined in SystemDesign.md §3.

**Request**

```json
{
  "source": "int main() {\n  int x = 5;\n  return x + 2;\n}",
  "options": {
    "targetOptimizations": ["constant-folding", "dead-code-elimination"],
    "stopAtPhase": null
  }
}
```

**Response — 200 OK (success case)**

```json
{
  "status": "success",
  "tokens": [
    { "id": "t1", "type": "KEYWORD", "value": "int", "line": 1, "column": 1 },
    { "id": "t2", "type": "IDENTIFIER", "value": "main", "line": 1, "column": 5 }
  ],
  "ast": {
    "id": "n1",
    "kind": "FunctionDecl",
    "children": [],
    "line": 1
  },
  "symbolTable": [
    { "name": "x", "type": "int", "scope": "main", "declaredAt": 2 }
  ],
  "diagnostics": [],
  "tac": [
    { "id": "i1", "op": "=", "arg1": "5", "result": "x" }
  ],
  "optimization": {
    "before": [ { "id": "i1", "op": "=", "arg1": "5", "result": "x" } ],
    "after": [ { "id": "i1", "op": "=", "arg1": "5", "result": "x" } ],
    "passesApplied": ["constant-folding"]
  },
  "assembly": [
    { "instruction": "MOV", "operands": ["EAX", "5"] }
  ]
}
```

**Response — 200 OK (phase-failure case)**

```json
{
  "status": "failed",
  "failedAtPhase": "semantic",
  "tokens": [ "..." ],
  "ast": { "...": "partial AST up to failure point" },
  "symbolTable": [ "..." ],
  "diagnostics": [
    {
      "severity": "error",
      "message": "Undeclared variable 'y' used in expression",
      "line": 3,
      "phase": "semantic"
    }
  ],
  "tac": [],
  "optimization": null,
  "assembly": []
}
```

> Note: even on failure, HTTP status is `200` — compilation failure is a valid, expected product outcome, not a server error. Only genuine server-side faults (crash, timeout) return `5xx` (see §7).

---

## 4. Endpoint: Get Grammar Definition

### `GET /grammar/{grammarId}`

**Response — 200 OK**

```json
{
  "id": "c-like-v1",
  "name": "C-Like Subset Grammar",
  "productions": [
    { "lhs": "Program", "rhs": ["FunctionDecl*"] },
    { "lhs": "FunctionDecl", "rhs": ["Type", "IDENTIFIER", "(", "ParamList", ")", "Block"] }
  ],
  "sampleProgram": "int main() { return 0; }"
}
```

---

## 5. Endpoint: Compilation History

### `GET /history/{projectId}?limit=20&offset=0`

**Response — 200 OK**

```json
{
  "total": 47,
  "items": [
    {
      "id": "comp_9182",
      "projectId": "proj_42",
      "timestamp": "2026-07-20T10:15:00Z",
      "status": "success",
      "failedAtPhase": null
    },
    {
      "id": "comp_9181",
      "projectId": "proj_42",
      "timestamp": "2026-07-20T09:58:00Z",
      "status": "failed",
      "failedAtPhase": "syntax"
    }
  ]
}
```

---

## 6. Endpoint: Project CRUD (v3, listed here for contract continuity)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/projects` | List all projects |
| `POST` | `/projects` | Create a project |
| `GET` | `/projects/{id}` | Get project detail |
| `PATCH` | `/projects/{id}` | Rename/update project |
| `DELETE` | `/projects/{id}` | Delete project |

Detailed request/response bodies for these will be finalized at the start of v3 (per Phases.md §6.4 — documentation is filled in when the version that needs it begins, not speculatively in full).

---

## 7. Error Envelope (All Endpoints)

```json
{
  "error": {
    "code": "COMPILATION_TIMEOUT",
    "message": "Compilation exceeded the maximum allowed execution time.",
    "statusCode": 504
  }
}
```

| Code | HTTP Status | Meaning |
|---|---|---|
| `INVALID_REQUEST` | 400 | Malformed request body |
| `UNAUTHORIZED` | 401 | Missing/invalid auth token (v3+) |
| `NOT_FOUND` | 404 | Resource (project, grammar, history item) not found |
| `COMPILATION_TIMEOUT` | 504 | Backend compiler exceeded execution budget |
| `INTERNAL_ERROR` | 500 | Unhandled server fault |

---

## 8. Versioning Policy

- All routes prefixed `/api/v1/` from the start, even though v1 (product roadmap) has no backend — this avoids an awkward `/api/v2/` rename later purely for API versioning reasons. Product version (v1–v4 in Phases.md) and API version (`/api/v1`) are intentionally decoupled concepts.
- Breaking changes to any response shape require a new API version prefix (`/api/v2/`), never an in-place breaking change to `/api/v1/`.
