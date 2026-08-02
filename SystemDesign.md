# System Design Document

## SmartCC — Module & Data Model Specification

| Field | Value |
|---|---|
| Version | 1.0 |
| Depends On | PRD.md, Architecture.md |

---

## 1. Purpose

This document defines the **system-level building blocks** of SmartCC: the conceptual compiler modules, the shared data models (TypeScript types) that flow between them, page-level system specs, and the mock-data contract that stands in for the backend during Phase 1.

---

## 2. Compiler Pipeline — Module Responsibilities

| Module | Responsibility | Output Consumed By |
|---|---|---|
| **Lexer** | Tokenizes raw source into a token stream | Token Viewer, Parser |
| **Parser** | Builds Parse Tree / AST from tokens; validates grammar | Parse Tree View, Semantic Analyzer |
| **Semantic Analyzer** | Type checking, scope resolution, symbol table construction | Symbol Table View, Semantic Report |
| **Intermediate Code Generator** | Converts AST into Three Address Code (TAC) | TAC Viewer |
| **Optimizer** | Applies optimization passes (constant folding, dead code elimination, etc.) on TAC | Optimization Comparison View |
| **Target Code Generator** | Emits assembly-like target output from optimized TAC | Assembly Viewer |

Each module is **independently invokable** in the mock layer — i.e., a mock fixture exists per module output, so any single visualization can be developed/tested without requiring the full pipeline to be "real."

---

## 3. Core Data Models (Shared Types)

```typescript
// ---- Lexer ----
interface Token {
  id: string;
  type: TokenType;         // KEYWORD | IDENTIFIER | OPERATOR | LITERAL | ...
  value: string;
  line: number;
  column: number;
}

// ---- Parser ----
interface ASTNode {
  id: string;
  kind: string;             // "BinaryExpr", "IfStatement", "FunctionDecl", ...
  children: ASTNode[];
  line: number;
  metadata?: Record<string, unknown>;
}

// ---- Semantic Analysis ----
interface SymbolEntry {
  name: string;
  type: string;             // int, float, function, etc.
  scope: string;
  declaredAt: number;       // line number
}

interface SemanticDiagnostic {
  severity: "error" | "warning";
  message: string;
  line: number;
  phase: CompilerPhase;
}

// ---- Intermediate Code ----
interface TACInstruction {
  id: string;
  op: string;               // "=", "+", "goto", "if", ...
  arg1?: string;
  arg2?: string;
  result?: string;
  label?: string;
}

// ---- Optimization ----
interface OptimizationDiff {
  before: TACInstruction[];
  after: TACInstruction[];
  passesApplied: string[];  // ["Constant Folding", "Dead Code Elimination"]
}

// ---- Target Code ----
interface AssemblyLine {
  instruction: string;
  operands: string[];
  comment?: string;
}

// ---- Aggregate Result ----
type CompilerPhase =
  | "lexical" | "syntax" | "semantic"
  | "intermediate" | "optimization" | "codegen";

interface CompilationResult {
  tokens: Token[];
  ast: ASTNode;
  symbolTable: SymbolEntry[];
  diagnostics: SemanticDiagnostic[];
  tac: TACInstruction[];
  optimization: OptimizationDiff;
  assembly: AssemblyLine[];
  status: "success" | "failed";
  failedAtPhase?: CompilerPhase;
}
```

> These types are defined once in `src/types/compiler.ts` and imported everywhere — the mock adapter, the future HTTP adapter, and every visualization component all share this single contract.

---

## 4. Page-Level System Specs

### 4.1 Dashboard
- **Data needed:** project count, compilation count, error-rate trend, recent projects (n=5), recent compilations (n=5), phase-wise average time.
- **Mock source:** `dashboardStats.json`

### 4.2 Compiler Workspace
- **Data needed:** full `CompilationResult` per compile action; source code buffer (Monaco).
- **Interactions:** compile trigger → loading state → populate all sub-panels → error panel shows `diagnostics` filtered by phase.
- **Mock source:** `sampleCompilations/*.json` (multiple sample programs covering success + phase-specific failure cases)

### 4.3 Grammar Library
- **Data needed:** list of supported grammar rules/productions for the C-like subset; example programs per rule.
- **Mock source:** `grammarLibrary.json`

### 4.4 Compilation History
- **Data needed:** list of past `CompilationRecord` (timestamp, project, status, phase reached).
- **Mock source:** `history.json`

### 4.5 Reports
- **Data needed:** aggregated stats across compilations (most common error types, phase failure distribution).
- **Mock source:** derived client-side from `history.json` (no separate fixture needed initially)

---

## 5. Error Handling Model

Errors are always **phase-tagged**, never generic:

```typescript
{
  severity: "error",
  message: "Undeclared variable 'x' used in expression",
  line: 14,
  phase: "semantic"
}
```

The Error Panel in the Workspace groups diagnostics by `phase`, so a student immediately understands **which compiler stage** rejected their program — this is the core pedagogical value of the product and must never be diluted into a flat, unstructured error list.

---

## 6. Mock Data Strategy

| Requirement | Approach |
|---|---|
| Realism | Mock fixtures generated from actual manual compilation traces of sample C-like programs (not randomly invented data) |
| Coverage | At least one fixture per phase-failure scenario (lexical error, syntax error, semantic error, clean success) |
| Consistency | All fixtures conform strictly to the `CompilationResult` type — enforced via TypeScript, not just convention |
| Swap-readiness | Fixtures live behind `compilerService.compile()`, never imported directly into components |

---

## 7. System Constraints (Current Phase)

- No backend execution — all "compilation" is pre-recorded mock output selected based on input matching or a simple simulated delay.
- No persistence layer (projects/history reset on reload, unless local storage is explicitly scoped in a later sprint).
- No authentication/multi-user support in this phase.

---

## 8. Traceability Matrix (PRD → Architecture → System)

| PRD Requirement | Architecture Component | System Data Model |
|---|---|---|
| Token Viewer | `features/compiler-workspace/components/TokenViewer` | `Token[]` |
| Parse Tree | `ParseTreeView` (React Flow) | `ASTNode` |
| Symbol Table | `SymbolTableView` (TanStack Table) | `SymbolEntry[]` |
| Semantic Report | `SemanticReportPanel` | `SemanticDiagnostic[]` |
| Three Address Code | `TACViewer` | `TACInstruction[]` |
| Optimization Comparison | `OptimizationDiffView` | `OptimizationDiff` |
| Assembly Viewer | `AssemblyViewer` | `AssemblyLine[]` |
| Error Panel | `ErrorPanel` | `SemanticDiagnostic[]` (filtered) |

This matrix ensures every PRD requirement maps to exactly one architectural component and one data model — no orphaned requirements, no undocumented components.
