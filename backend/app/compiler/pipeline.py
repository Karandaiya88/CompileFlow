"""
Pipeline orchestrator -- Sprint 9 scaffold only.

None of the real compiler phases exist yet. This returns a fixed stub
result so the /compile endpoint's request/response shape can be built,
tested, and pointed at by the frontend's httpAdapter (Architecture.md
Section 8) before any real compiler logic exists.

Real phases replace this stub incrementally, per Phases.md v2 roadmap:
  Sprint 10 -- real Lexer (PLY) replaces the stub token list
  Sprint 11 -- real Parser replaces the stub AST
  Sprint 12 -- real Semantic Analyzer replaces the stub symbol table/diagnostics
  Sprint 13 -- real TAC generation + Optimizer replace the stub tac/optimization
  Sprint 14 -- real target codegen replaces the stub assembly

Do not add real lexer/parser logic here yet -- this file's only job right
now is to prove the endpoint contract end-to-end. Jumping ahead to real
logic before Sprint 10 would violate the sprint-by-sprint approval gate
in Rules.md.
"""

from app.models.compiler import (
    AssemblyLine,
    ASTNode,
    CompilationResult,
    CompilerPhase,
    CompileStatus,
    OptimizationDiff,
    SemanticDiagnostic,
    Severity,
    SymbolEntry,
    TACInstruction,
    Token,
    TokenType,
)

_STUB_SUCCESS = CompilationResult(
    status=CompileStatus.SUCCESS,
    tokens=[
        Token(id="t1", type=TokenType.KEYWORD, value="int", line=1, column=1),
        Token(id="t2", type=TokenType.IDENTIFIER, value="main", line=1, column=5),
        Token(id="t3", type=TokenType.PUNCTUATION, value="(", line=1, column=9),
        Token(id="t4", type=TokenType.PUNCTUATION, value=")", line=1, column=10),
        Token(id="t5", type=TokenType.PUNCTUATION, value="{", line=1, column=12),
        Token(id="t6", type=TokenType.KEYWORD, value="int", line=1, column=14),
        Token(id="t7", type=TokenType.IDENTIFIER, value="x", line=1, column=18),
        Token(id="t8", type=TokenType.OPERATOR, value="=", line=1, column=20),
        Token(id="t9", type=TokenType.LITERAL, value="5", line=1, column=22),
        Token(id="t10", type=TokenType.PUNCTUATION, value=";", line=1, column=23),
        Token(id="t11", type=TokenType.KEYWORD, value="return", line=1, column=25),
        Token(id="t12", type=TokenType.IDENTIFIER, value="x", line=1, column=32),
        Token(id="t13", type=TokenType.OPERATOR, value="+", line=1, column=34),
        Token(id="t14", type=TokenType.LITERAL, value="2", line=1, column=36),
        Token(id="t15", type=TokenType.PUNCTUATION, value=";", line=1, column=37),
        Token(id="t16", type=TokenType.PUNCTUATION, value="}", line=1, column=39),
    ],
    ast=ASTNode(
        id="n1",
        kind="FunctionDecl",
        line=1,
        metadata={"name": "main", "returnType": "int"},
        children=[
            ASTNode(
                id="n2",
                kind="VarDecl",
                line=1,
                metadata={"name": "x", "varType": "int"},
                children=[ASTNode(id="n3", kind="Literal", line=1, metadata={"value": "5"}, children=[])],
            ),
            ASTNode(
                id="n4",
                kind="ReturnStatement",
                line=1,
                children=[
                    ASTNode(
                        id="n5",
                        kind="BinaryExpr",
                        line=1,
                        metadata={"operator": "+"},
                        children=[
                            ASTNode(id="n6", kind="Identifier", line=1, metadata={"name": "x"}, children=[]),
                            ASTNode(id="n7", kind="Literal", line=1, metadata={"value": "2"}, children=[]),
                        ],
                    )
                ],
            ),
        ],
    ),
    symbolTable=[SymbolEntry(name="x", type="int", scope="main", declaredAt=1)],
    diagnostics=[],
    tac=[
        TACInstruction(id="i1", op="=", arg1="5", result="x"),
        TACInstruction(id="i2", op="+", arg1="x", arg2="2", result="t1"),
        TACInstruction(id="i3", op="return", arg1="t1"),
    ],
    optimization=OptimizationDiff(
        before=[
            TACInstruction(id="i1", op="=", arg1="5", result="x"),
            TACInstruction(id="i2", op="+", arg1="x", arg2="2", result="t1"),
            TACInstruction(id="i3", op="return", arg1="t1"),
        ],
        after=[
            TACInstruction(id="i1b", op="=", arg1="5", result="x"),
            TACInstruction(id="i2b", op="return", arg1="7"),
        ],
        passesApplied=["Constant Folding"],
    ),
    assembly=[
        AssemblyLine(instruction="MOV", operands=["EAX", "5"]),
        AssemblyLine(instruction="MOV", operands=["[x]", "EAX"]),
        AssemblyLine(instruction="MOV", operands=["EAX", "7"], comment="folded x + 2 -> 7"),
        AssemblyLine(instruction="RET", operands=[]),
    ],
)

_STUB_SEMANTIC_FAILURE = CompilationResult(
    status=CompileStatus.FAILED,
    failedAtPhase=CompilerPhase.SEMANTIC,
    tokens=[
        Token(id="t1", type=TokenType.KEYWORD, value="int", line=1, column=1),
        Token(id="t2", type=TokenType.IDENTIFIER, value="main", line=1, column=5),
        Token(id="t3", type=TokenType.PUNCTUATION, value="(", line=1, column=9),
        Token(id="t4", type=TokenType.PUNCTUATION, value=")", line=1, column=10),
        Token(id="t5", type=TokenType.PUNCTUATION, value="{", line=1, column=12),
        Token(id="t6", type=TokenType.KEYWORD, value="return", line=1, column=14),
        Token(id="t7", type=TokenType.IDENTIFIER, value="undeclared_demo", line=1, column=21),
        Token(id="t8", type=TokenType.OPERATOR, value="+", line=1, column=37),
        Token(id="t9", type=TokenType.LITERAL, value="1", line=1, column=39),
        Token(id="t10", type=TokenType.PUNCTUATION, value=";", line=1, column=40),
        Token(id="t11", type=TokenType.PUNCTUATION, value="}", line=1, column=42),
    ],
    ast=ASTNode(
        id="n1",
        kind="FunctionDecl",
        line=1,
        metadata={"name": "main", "returnType": "int"},
        children=[
            ASTNode(
                id="n2",
                kind="ReturnStatement",
                line=1,
                children=[
                    ASTNode(
                        id="n3",
                        kind="BinaryExpr",
                        line=1,
                        metadata={"operator": "+"},
                        children=[
                            ASTNode(
                                id="n4",
                                kind="Identifier",
                                line=1,
                                metadata={"name": "undeclared_demo"},
                                children=[],
                            ),
                            ASTNode(id="n5", kind="Literal", line=1, metadata={"value": "1"}, children=[]),
                        ],
                    )
                ],
            )
        ],
    ),
    symbolTable=[],
    diagnostics=[
        SemanticDiagnostic(
            severity=Severity.ERROR,
            message="Undeclared variable 'undeclared_demo' used in expression.",
            line=1,
            phase=CompilerPhase.SEMANTIC,
        )
    ],
    tac=[],
    optimization=None,
    assembly=[],
)


def compile_source(source: str) -> CompilationResult:
    """Stub pipeline entry point. Deterministic routing mirrors the
    frontend's mockAdapter.ts so both sides demo identically during the
    transition period (Sprint 9-14)."""
    if not source.strip():
        raise ValueError("Source code is empty -- nothing to compile.")
    if "undeclared_demo" in source:
        return _STUB_SEMANTIC_FAILURE
    return _STUB_SUCCESS
