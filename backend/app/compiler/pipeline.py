"""
Pipeline orchestrator.

Sprint 12 update: semantic analysis is now real (app/compiler/semantic),
so undeclared-variable use, duplicate declarations, and unused-variable
warnings are genuinely detected for ANY program -- not just the special
`undeclared_demo` identifier the pipeline used to hardcode-match on
(Sprint 9-11). That hack is gone as of this sprint; it's no longer
needed now that real semantic analysis exists.

TAC generation, optimization, and target codegen are still not
implemented -- a semantically-valid program returns empty/None for
those fields rather than fabricated data, which would be actively
misleading now that everything upstream of it is real. Real phases
replace these next, per Phases.md v2 roadmap:
  Sprint 13 -- real TAC generation + Optimizer
  Sprint 14 -- real target codegen
"""

from app.compiler.lexer.lexer import tokenize
from app.compiler.parser.parser import parse
from app.compiler.semantic.analyzer import analyze
from app.models.compiler import (
    CompilationResult,
    CompilerPhase,
    CompileStatus,
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

    return CompilationResult(
        status=CompileStatus.FAILED if has_error else CompileStatus.SUCCESS,
        failedAtPhase=CompilerPhase.SEMANTIC if has_error else None,
        tokens=lex_result.tokens,
        ast=parse_result.ast,
        symbolTable=analysis.symbolTable,
        diagnostics=analysis.diagnostics,
        tac=[],
        optimization=None,
        assembly=[],
    )
