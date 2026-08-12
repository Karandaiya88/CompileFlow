"""
Pipeline orchestrator.

Sprint 10 update: tokenization is now real (app/compiler/lexer), so
lexical errors on arbitrary input are genuinely detected -- not just the
two canned demo fixtures below. Everything downstream of tokens (AST,
symbol table, diagnostics beyond lexical ones, TAC, optimization,
assembly) is still a fixed stub, since the parser doesn't exist until
Sprint 11.

Real phases replace the remaining stub incrementally, per Phases.md v2
roadmap:
  Sprint 11 -- real Parser replaces the stub AST
  Sprint 12 -- real Semantic Analyzer replaces the stub symbol table/diagnostics
  Sprint 13 -- real TAC generation + Optimizer replace the stub tac/optimization
  Sprint 14 -- real target codegen replaces the stub assembly
"""

from app.compiler.lexer.lexer import tokenize
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
    """Pipeline entry point.

    Real: tokenization, and lexical-error detection on genuinely
    arbitrary input.
    Still stub: everything from parsing onward -- routes to one of two
    canned downstream fixtures based on whether an `undeclared_demo`
    identifier token appears, same demo convention as the frontend's
    mockAdapter.ts, so both sides demo identically during the transition
    period (Sprint 10-14).
    """
    if not source.strip():
        raise ValueError("Source code is empty -- nothing to compile.")

    lex_result = tokenize(source)

    if lex_result.errors:
        first_error = lex_result.errors[0]
        return CompilationResult(
            status=CompileStatus.FAILED,
            failedAtPhase=CompilerPhase.LEXICAL,
            tokens=lex_result.tokens,
            ast=None,
            symbolTable=[],
            diagnostics=[
                SemanticDiagnostic(
                    severity=Severity.ERROR,
                    message=first_error.message,
                    line=first_error.line,
                    phase=CompilerPhase.LEXICAL,
                )
            ],
            tac=[],
            optimization=None,
            assembly=[],
        )

    has_undeclared_demo = any(
        t.type == TokenType.IDENTIFIER and t.value == "undeclared_demo" for t in lex_result.tokens
    )
    stub = _STUB_SEMANTIC_FAILURE if has_undeclared_demo else _STUB_SUCCESS

    # Real tokens override the stub's canned token list; everything else
    # in the stub (ast, symbolTable, tac, ...) is still simulated until
    # Sprint 11+.
    return stub.model_copy(update={"tokens": lex_result.tokens})
