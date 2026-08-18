"""
Semantic analyzer correctness tests -- Testing.md Section 2.2: "given AST
-> expect correct symbol table entries and diagnostics. Cover: undeclared
variable, type mismatch, duplicate declaration, scope shadowing."

(Type mismatch isn't meaningfully testable yet -- the grammar only
produces integer literals, so there's no type system depth to check
beyond what's covered here. Not faked; genuinely out of scope until the
grammar grows a real type system.)
"""

from app.compiler.parser.parser import parse
from app.compiler.semantic.analyzer import analyze


def _analyze(source: str):
    parse_result = parse(source)
    assert parse_result.errors == [], f"Unexpected syntax errors: {parse_result.errors}"
    return analyze(parse_result.ast)


def test_clean_program_has_no_diagnostics():
    result = _analyze("int main() {\n  int x = 5;\n  return x + 2;\n}")
    assert result.diagnostics == []
    assert len(result.symbolTable) == 1
    assert result.symbolTable[0].name == "x"
    assert result.symbolTable[0].type == "int"
    assert result.symbolTable[0].scope == "main"
    assert result.symbolTable[0].declaredAt == 2


def test_undeclared_variable_in_return_is_flagged():
    result = _analyze("int main() { return undeclared_demo + 1; }")
    errors = [d for d in result.diagnostics if d.severity == "error"]
    assert len(errors) == 1
    assert "undeclared_demo" in errors[0].message
    assert errors[0].phase == "semantic"


def test_undeclared_variable_works_for_any_identifier_not_just_the_demo_one():
    """This is the whole point of Sprint 12: the old pipeline could only
    detect the one hardcoded 'undeclared_demo' name. Real analysis must
    catch ANY undeclared identifier."""
    result = _analyze("int main() { return totally_different_name; }")
    errors = [d for d in result.diagnostics if d.severity == "error"]
    assert len(errors) == 1
    assert "totally_different_name" in errors[0].message


def test_duplicate_declaration_is_flagged():
    result = _analyze("int main() {\n  int x = 1;\n  int x = 2;\n  return x;\n}")
    errors = [d for d in result.diagnostics if d.severity == "error"]
    assert len(errors) == 1
    assert "already declared" in errors[0].message
    # Only the first declaration makes it into the symbol table.
    assert len(result.symbolTable) == 1


def test_self_referential_initializer_is_undeclared_not_self_declared():
    """`int x = x;` -- the RHS `x` must be checked against symbols
    declared BEFORE this statement, so it's correctly flagged as
    undeclared rather than seeing its own incomplete declaration."""
    result = _analyze("int main() {\n  int x = x;\n  return 0;\n}")
    errors = [d for d in result.diagnostics if d.severity == "error"]
    assert len(errors) == 1
    assert "undeclared" in errors[0].message.lower()


def test_unused_variable_produces_warning_not_error():
    result = _analyze("int main() {\n  int unused = 5;\n  return 0;\n}")
    warnings = [d for d in result.diagnostics if d.severity == "warning"]
    errors = [d for d in result.diagnostics if d.severity == "error"]
    assert errors == []
    assert len(warnings) == 1
    assert "never used" in warnings[0].message


def test_assignment_to_undeclared_variable_is_flagged():
    result = _analyze("int main() {\n  x = 5;\n  return 0;\n}")
    errors = [d for d in result.diagnostics if d.severity == "error"]
    assert len(errors) == 1
    assert "x" in errors[0].message


def test_functions_have_independent_scopes():
    """The same variable name in two different functions must NOT be
    flagged as a duplicate declaration -- each function is its own scope."""
    result = _analyze(
        "int foo() { int x = 1; return x; } int bar() { int x = 2; return x; }"
    )
    assert result.diagnostics == []
    assert len(result.symbolTable) == 2
    assert result.symbolTable[0].scope == "foo"
    assert result.symbolTable[1].scope == "bar"


def test_variable_used_in_binary_expression_counts_as_used():
    """Regression guard: a variable only referenced inside a BinaryExpr
    (not directly in `return x;`) must still count as used."""
    result = _analyze("int main() {\n  int x = 5;\n  return x + 1;\n}")
    warnings = [d for d in result.diagnostics if d.severity == "warning"]
    assert warnings == []
