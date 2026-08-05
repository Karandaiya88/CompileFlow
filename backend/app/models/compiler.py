"""
Pydantic models for the compiler pipeline.

Source of truth: SystemDesign.md Section 3 and frontend/src/types/compiler.ts.
These field names and shapes must stay in lockstep with the TypeScript
types -- any change here without a matching frontend change breaks the
contract that Architecture.md Section 8 promised (mock adapter swaps to
httpAdapter with zero component changes).
"""

from enum import Enum

from pydantic import BaseModel, Field


class TokenType(str, Enum):
    KEYWORD = "KEYWORD"
    IDENTIFIER = "IDENTIFIER"
    OPERATOR = "OPERATOR"
    LITERAL = "LITERAL"
    PUNCTUATION = "PUNCTUATION"
    COMMENT = "COMMENT"


class CompilerPhase(str, Enum):
    LEXICAL = "lexical"
    SYNTAX = "syntax"
    SEMANTIC = "semantic"
    INTERMEDIATE = "intermediate"
    OPTIMIZATION = "optimization"
    CODEGEN = "codegen"


class Token(BaseModel):
    id: str
    type: TokenType
    value: str
    line: int
    column: int


class ASTNode(BaseModel):
    id: str
    kind: str
    children: list["ASTNode"] = Field(default_factory=list)
    line: int
    metadata: dict | None = None


ASTNode.model_rebuild()


class SymbolEntry(BaseModel):
    name: str
    type: str
    scope: str
    declaredAt: int


class Severity(str, Enum):
    ERROR = "error"
    WARNING = "warning"


class SemanticDiagnostic(BaseModel):
    severity: Severity
    message: str
    line: int
    phase: CompilerPhase


class TACInstruction(BaseModel):
    id: str
    op: str
    arg1: str | None = None
    arg2: str | None = None
    result: str | None = None
    label: str | None = None


class OptimizationDiff(BaseModel):
    before: list[TACInstruction]
    after: list[TACInstruction]
    passesApplied: list[str]


class AssemblyLine(BaseModel):
    instruction: str
    operands: list[str]
    comment: str | None = None


class CompileStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"


class CompilationResult(BaseModel):
    tokens: list[Token]
    ast: ASTNode | None
    symbolTable: list[SymbolEntry]
    diagnostics: list[SemanticDiagnostic]
    tac: list[TACInstruction]
    optimization: OptimizationDiff | None
    assembly: list[AssemblyLine]
    status: CompileStatus
    failedAtPhase: CompilerPhase | None = None


class CompileOptions(BaseModel):
    targetOptimizations: list[str] | None = None
    stopAtPhase: str | None = None


class CompileRequest(BaseModel):
    source: str
    options: CompileOptions | None = None


class GrammarProduction(BaseModel):
    lhs: str
    rhs: list[str]


class GrammarDefinition(BaseModel):
    id: str
    name: str
    productions: list[GrammarProduction]
    sampleProgram: str


class CompilationRecord(BaseModel):
    id: str
    projectId: str
    timestamp: str
    status: CompileStatus
    failedAtPhase: CompilerPhase | None = None


class HistoryResponse(BaseModel):
    total: int
    items: list[CompilationRecord]


class ErrorDetail(BaseModel):
    code: str
    message: str
    statusCode: int


class ErrorResponse(BaseModel):
    error: ErrorDetail
