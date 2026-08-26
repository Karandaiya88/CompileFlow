"""
Pipeline orchestrator.

Sprint 13 update: TAC generation and optimization are now real
(app/compiler/optimizer/), so a semantically-valid program gets a real,
program-specific instruction sequence and a real constant-folding pass
-- not the empty placeholders Sprint 12 correctly used once the old
canned fixtures were removed.

Target codegen is still not implemented -- `assembly` stays `[]` until
Sprint 14, per Phases.md v2 roadmap.
"""

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
    """Pipeline entry point.

    Real: tokenization, parsing, and semantic analysis -- lexical,
    syntax, and semantic errors are all genuinely detected on arbitrary
    input now.
    Still stub: TAC generation, optimization, and codegen (Sprint 13-14)
    -- a semantically-valid program gets empty/None for those fields,
    not fabricated data.
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
        assembly=[],
    )
