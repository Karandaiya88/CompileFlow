"""
Parser correctness tests -- Testing.md Section 2.2: "given token stream
-> expect exact AST shape. Include invalid-grammar cases and assert the
correct syntax error is raised."
"""

from app.compiler.parser.parser import parse


def test_simple_function_produces_expected_ast_shape():
    result = parse("int main() {\n  int x = 5;\n  return x + 2;\n}")
    assert result.errors == []
    ast = result.ast
    assert ast.kind == "FunctionDecl"
    assert ast.metadata == {"name": "main", "returnType": "int"}
    assert [c.kind for c in ast.children] == ["VarDecl", "ReturnStatement"]

    var_decl, return_stmt = ast.children
    assert var_decl.metadata == {"name": "x", "varType": "int"}
    assert var_decl.children[0].kind == "Literal"
    assert var_decl.children[0].metadata == {"value": "5"}

    binary_expr = return_stmt.children[0]
    assert binary_expr.kind == "BinaryExpr"
    assert binary_expr.metadata == {"operator": "+"}
    assert binary_expr.children[0].kind == "Identifier"
    assert binary_expr.children[0].metadata == {"name": "x"}
    assert binary_expr.children[1].kind == "Literal"
    assert binary_expr.children[1].metadata == {"value": "2"}


def test_var_decl_without_initializer():
    result = parse("int main() {\n  int x;\n  return x;\n}")
    assert result.errors == []
    var_decl = result.ast.children[0]
    assert var_decl.kind == "VarDecl"
    assert var_decl.children == []


def test_assignment_statement():
    result = parse("int main() {\n  int x;\n  x = 5;\n  return x;\n}")
    assert result.errors == []
    assign = result.ast.children[1]
    assert assign.kind == "AssignStatement"
    assert assign.metadata == {"name": "x"}
    assert assign.children[0].kind == "Literal"


def test_operator_precedence_multiplication_binds_tighter_than_addition():
    """`2 + 3 * 4` must parse as `2 + (3 * 4)`, not `(2 + 3) * 4`."""
    result = parse("int main() {\n  return 2 + 3 * 4;\n}")
    assert result.errors == []
    top = result.ast.children[0].children[0]
    assert top.kind == "BinaryExpr"
    assert top.metadata["operator"] == "+"
    assert top.children[0].kind == "Literal"
    assert top.children[0].metadata == {"value": "2"}
    right = top.children[1]
    assert right.kind == "BinaryExpr"
    assert right.metadata["operator"] == "*"


def test_parentheses_override_precedence():
    """`(2 + 3) * 4` must keep the addition grouped despite lower
    precedence, because of the explicit parentheses."""
    result = parse("int main() {\n  return (2 + 3) * 4;\n}")
    assert result.errors == []
    top = result.ast.children[0].children[0]
    assert top.metadata["operator"] == "*"
    assert top.children[0].metadata["operator"] == "+"


def test_multiple_function_declarations():
    result = parse("int foo() { return 1; } int bar() { return 2; }")
    assert result.errors == []
    assert result.ast.kind == "Program"
    assert [c.metadata["name"] for c in result.ast.children] == ["foo", "bar"]


def test_comments_are_ignored_by_the_parser():
    """Comments tokenize (Sprint 10) but have no grammar production --
    the parser must skip them, not treat them as a syntax error."""
    result = parse("int main() {\n  int x = 5; // set x\n  /* multi\n  line */ return x;\n}")
    assert result.errors == []
    assert result.ast.kind == "FunctionDecl"


def test_missing_semicolon_is_a_syntax_error():
    result = parse("int main() { int x = 5 return x; }")
    assert result.ast is None
    assert len(result.errors) == 1
    assert "return" in result.errors[0].message


def test_missing_closing_brace_is_a_syntax_error():
    result = parse("int main() { return 0;")
    assert result.ast is None
    assert len(result.errors) == 1


def test_undeclared_demo_identifier_parses_fine_syntactically():
    """This project's canned semantic-failure demo relies on this
    program being syntactically valid -- semantic analysis (Sprint 12)
    is what should reject it, not the parser."""
    result = parse("int main() { return undeclared_demo + 1; }")
    assert result.errors == []
    assert result.ast is not None
