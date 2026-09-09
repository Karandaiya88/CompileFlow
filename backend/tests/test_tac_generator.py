

from app.compiler.optimizer.tac_generator import generate_tac
from app.compiler.parser.parser import parse


def _tac(source: str):
    result = parse(source)
    assert result.errors == []
    return generate_tac(result.ast)


def test_simple_var_decl_and_return():
    tac = _tac("int main() {\n  int x = 5;\n  return x + 2;\n}")
    assert [(i.op, i.arg1, i.arg2, i.result) for i in tac] == [
        ("=", "5", None, "x"),
        ("+", "x", "2", "t1"),
        ("return", "t1", None, None),
    ]


def test_var_decl_without_initializer_emits_no_instruction():
    tac = _tac("int main() {\n  int x;\n  return 0;\n}")
    assert [i.op for i in tac] == ["return"]


def test_assignment_statement_generates_assignment_instruction():
    tac = _tac("int main() {\n  int x;\n  x = 5;\n  return x;\n}")
    assign_instr = [i for i in tac if i.result == "x" and i.op == "="]
    assert len(assign_instr) == 1
    assert assign_instr[0].arg1 == "5"


def test_nested_binary_expressions_produce_chained_temps():
    """`2 + 3 * 4` (parses as `2 + (3*4)` per Sprint 11 precedence) must
    compute the inner multiplication into a temp before the outer add
    uses it."""
    tac = _tac("int main() {\n  return 2 + 3 * 4;\n}")
    ops = [(i.op, i.arg1, i.arg2, i.result) for i in tac]
    # First the multiplication (3*4) into t1, then addition (2+t1) into t2.
    assert ops[0] == ("*", "3", "4", "t1")
    assert ops[1] == ("+", "2", "t1", "t2")
    assert ops[2][0] == "return"


def test_parenthesized_expression_respects_grouping_in_tac():
    tac = _tac("int main() {\n  return (2 + 3) * 4;\n}")
    ops = [(i.op, i.arg1, i.arg2, i.result) for i in tac]
    assert ops[0] == ("+", "2", "3", "t1")
    assert ops[1] == ("*", "t1", "4", "t2")


def test_temp_counter_resets_per_function():
    tac = _tac(
        "int foo() { return 1 + 2; } int bar() { return 3 + 4; }"
    )
    binary_ops = [i for i in tac if i.op == "+"]
    assert binary_ops[0].result == "t1"
    assert binary_ops[1].result == "t1"  # reset for the second function


def test_multi_function_program_gets_labels():
    tac = _tac("int foo() { return 1; } int bar() { return 2; }")
    labels = [i for i in tac if i.op == "label"]
    assert [x.label for x in labels] == ["foo", "bar"]


def test_single_function_program_has_no_label():
    """Keeps the common case's output exactly as clean as the original
    demo fixture (no label noise for the 95% case of one function)."""
    tac = _tac("int main() { return 0; }")
    assert all(i.op != "label" for i in tac)
