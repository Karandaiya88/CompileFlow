/**
 * Shared compiler data models.
 * Source of truth: SystemDesign.md Section 3.
 *
 * These types are used by the mock adapter (v1), the future HTTP adapter
 * (v2, see Architecture.md Section 8), and every visualization component.
 * Never redefine these shapes locally in a feature/component file.
 */

// ---- Lexer ----
export type TokenType =
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'OPERATOR'
  | 'LITERAL'
  | 'PUNCTUATION'
  | 'COMMENT';

export interface Token {
  id: string;
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

// ---- Parser ----
export interface ASTNode {
  id: string;
  kind: string; // "BinaryExpr", "IfStatement", "FunctionDecl", ...
  children: ASTNode[];
  line: number;
  metadata?: Record<string, unknown>;
}

// ---- Semantic Analysis ----
export interface SymbolEntry {
  name: string;
  type: string; // int, float, function, etc.
  scope: string;
  declaredAt: number; // line number
}

export type CompilerPhase =
  | 'lexical'
  | 'syntax'
  | 'semantic'
  | 'intermediate'
  | 'optimization'
  | 'codegen';

export interface SemanticDiagnostic {
  severity: 'error' | 'warning';
  message: string;
  line: number;
  phase: CompilerPhase;
}

// ---- Intermediate Code ----
export interface TACInstruction {
  id: string;
  op: string; // "=", "+", "goto", "if", ...
  arg1?: string;
  arg2?: string;
  result?: string;
  label?: string;
}

// ---- Optimization ----
export interface OptimizationDiff {
  before: TACInstruction[];
  after: TACInstruction[];
  passesApplied: string[]; // ["Constant Folding", "Dead Code Elimination"]
}

// ---- Target Code ----
export interface AssemblyLine {
  instruction: string;
  operands: string[];
  comment?: string;
}

// ---- Aggregate Result ----
export interface CompilationResult {
  tokens: Token[];
  ast: ASTNode | null;
  symbolTable: SymbolEntry[];
  diagnostics: SemanticDiagnostic[];
  tac: TACInstruction[];
  optimization: OptimizationDiff | null;
  assembly: AssemblyLine[];
  status: 'success' | 'failed';
  failedAtPhase?: CompilerPhase;
}

// ---- Compilation history record (Dashboard / History pages) ----
export interface CompilationRecord {
  id: string;
  projectId: string;
  timestamp: string; // ISO 8601
  status: 'success' | 'failed';
  failedAtPhase: CompilerPhase | null;
}

// ---- Grammar Library ----
export interface GrammarProduction {
  lhs: string;
  rhs: string[];
}

export interface GrammarDefinition {
  id: string;
  name: string;
  productions: GrammarProduction[];
  sampleProgram: string;
}

// ---- Project ----
export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  language: 'c-like';
}

/** Phase display metadata -- keeps labels/order consistent across the app. */
export const COMPILER_PHASES: { key: CompilerPhase; label: string }[] = [
  { key: 'lexical', label: 'Lexical Analysis' },
  { key: 'syntax', label: 'Syntax Analysis' },
  { key: 'semantic', label: 'Semantic Analysis' },
  { key: 'intermediate', label: 'Intermediate Code' },
  { key: 'optimization', label: 'Optimization' },
  { key: 'codegen', label: 'Code Generation' },
];
