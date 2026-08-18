"""
Real semantic analyzer -- Sprint 12 (Phases.md v2).

Walks the real AST (app.compiler.parser) and produces a real symbol
table plus real diagnostics: undeclared-variable use, duplicate
declaration in the same scope, and unused-variable warnings.

Scope model: function-level only, one scope per FunctionDecl (matching
SymbolEntry.scope's existing convention of a function name, e.g.
"main"). The grammar has no nested blocks yet (if/while bodies aren't
parsed -- Sprint 11's documented gap), so block-level scoping doesn't
apply yet; this is a faithful reflection of what the parser actually
produces, not an oversimplification bolted on top of a richer AST.

Public API: `analyze(ast: ASTNode) -> AnalysisResult`.
"""

from dataclasses import dataclass, field

from app.models.compiler import (
    ASTNode,
    CompilerPhase,
    SemanticDiagnostic,
    Severity,
    SymbolEntry,
)


@dataclass
class AnalysisResult:
    symbolTable: list[SymbolEntry] = field(default_factory=list)
    diagnostics: list[SemanticDiagnostic] = field(default_factory=list)


def analyze(ast: ASTNode) -> AnalysisResult:
    result = AnalysisResult()
    function_decls = ast.children if ast.kind == "Program" else [ast]
    for func in function_decls:
        _analyze_function(func, result)
    return result


def _analyze_function(func: ASTNode, result: AnalysisResult) -> None:
    scope = (func.metadata or {}).get("name", "unknown")
    declared: dict[str, SymbolEntry] = {}
    used: set[str] = set()

    def declare(name: str, var_type: str, line: int) -> None:
        if name in declared:
            result.diagnostics.append(
                SemanticDiagnostic(
                    severity=Severity.ERROR,
                    message=f"Variable '{name}' is already declared in this scope.",
                    line=line,
                    phase=CompilerPhase.SEMANTIC,
                )
            )
            return
        entry = SymbolEntry(name=name, type=var_type, scope=scope, declaredAt=line)
        declared[name] = entry
        result.symbolTable.append(entry)

    def check_expr(node: ASTNode) -> None:
        if node.kind == "Identifier":
            name = (node.metadata or {}).get("name")
            if name not in declared:
                result.diagnostics.append(
                    SemanticDiagnostic(
                        severity=Severity.ERROR,
                        message=f"Undeclared variable '{name}' used in expression.",
                        line=node.line,
                        phase=CompilerPhase.SEMANTIC,
                    )
                )
            else:
                used.add(name)
        else:
            # Literal has no children; BinaryExpr (and anything else
            # with sub-expressions) recurses into them uniformly.
            for child in node.children:
                check_expr(child)

    for stmt in func.children:
        if stmt.kind == "VarDecl":
            name = (stmt.metadata or {}).get("name")
            var_type = (stmt.metadata or {}).get("varType")
            # Check the initializer BEFORE declaring the variable itself,
            # so `int x = x;` correctly flags x as undeclared rather than
            # letting it see its own not-yet-complete declaration.
            if stmt.children:
                check_expr(stmt.children[0])
            declare(name, var_type, stmt.line)

        elif stmt.kind == "AssignStatement":
            name = (stmt.metadata or {}).get("name")
            if name not in declared:
                result.diagnostics.append(
                    SemanticDiagnostic(
                        severity=Severity.ERROR,
                        message=f"Undeclared variable '{name}' used in expression.",
                        line=stmt.line,
                        phase=CompilerPhase.SEMANTIC,
                    )
                )
            if stmt.children:
                check_expr(stmt.children[0])

        elif stmt.kind == "ReturnStatement":
            if stmt.children:
                check_expr(stmt.children[0])

    for name, entry in declared.items():
        if name not in used:
            result.diagnostics.append(
                SemanticDiagnostic(
                    severity=Severity.WARNING,
                    message=f"Variable '{name}' is declared but never used.",
                    line=entry.declaredAt,
                    phase=CompilerPhase.SEMANTIC,
                )
            )
