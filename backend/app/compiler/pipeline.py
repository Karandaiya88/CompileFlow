"""
Pipeline orchestrator.

Sprint 14 update: target codegen is now real (app/compiler/codegen), so
a semantically-valid program gets a real, program-specific assembly
listing -- not the empty placeholder Sprint 13 correctly used.

This completes every real compiler phase. The pipeline no longer
contains any stub or placeholder logic for the compilation itself --
tokens, AST, symbol table, diagnostics, TAC, optimization, and assembly
are all genuinely computed from whatever source the caller submits.

Sprint 15 (the only thing left in v2) doesn't touch this file at all --
it's purely a frontend change: swapping `mockAdapter` for an `httpAdapter`
that calls this API instead. See Phases.md.
"""

from app.compiler.codegen.codegen import generate_assembly
from app.compiler.lexer.lexer import tokenize
from app.compiler.optimizer.optimizer import optimize
from app.compiler.optimizer.tac_generator import generate_tac
from app.compiler.parser.parser import parse
from app.compiler.semantic.analyzer import analyze
from app.models.compiler import (
    CompilationResult,
    CompilerPhase,
    CompileStatus,
    OptimizationDiff,
    SemanticDiagnostic,
    Severity,
)


def compile_source(source: str) -> CompilationResult:
    """Pipeline entry point. Every phase is real: tokenization, parsing,
    semantic analysis, TAC generation, optimization, and codegen. No
    stub or placeholder data remains anywhere in this function."""
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

    parse_result = parse(source)
    if parse_result.errors:
        first_error = parse_result.errors[0]
        return CompilationResult(
            status=CompileStatus.FAILED,
            failedAtPhase=CompilerPhase.SYNTAX,
            tokens=lex_result.tokens,
            ast=None,
            symbolTable=[],
            diagnostics=[
                SemanticDiagnostic(
                    severity=Severity.ERROR,
                    message=first_error.message,
                    line=first_error.line if first_error.line > 0 else lex_result.tokens[-1].line,
                    phase=CompilerPhase.SYNTAX,
                )
            ],
            tac=[],
            optimization=None,
            assembly=[],
        )

    analysis = analyze(parse_result.ast)
    has_error = any(d.severity == Severity.ERROR for d in analysis.diagnostics)

    if has_error:
        return CompilationResult(
            status=CompileStatus.FAILED,
            failedAtPhase=CompilerPhase.SEMANTIC,
            tokens=lex_result.tokens,
            ast=parse_result.ast,
            symbolTable=analysis.symbolTable,
            diagnostics=analysis.diagnostics,
            tac=[],
            optimization=None,
            assembly=[],
        )

    tac = generate_tac(parse_result.ast)
    opt_result = optimize(tac)
    assembly = generate_assembly(opt_result.after)

    return CompilationResult(
        status=CompileStatus.SUCCESS,
        failedAtPhase=None,
        tokens=lex_result.tokens,
        ast=parse_result.ast,
        symbolTable=analysis.symbolTable,
        diagnostics=analysis.diagnostics,
        tac=tac,
        optimization=OptimizationDiff(
            before=tac, after=opt_result.after, passesApplied=opt_result.passes_applied
        ),
        assembly=assembly,
    )
