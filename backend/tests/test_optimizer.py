"""
Optimizer correctness tests -- Testing.md Section 2.2: "given TAC ->
expect optimized TAC matching hand-verified 'correct' optimization
output per pass (constant folding tested independently, then in
combination)."
"""

from app.compiler.optimizer.optimizer import optimize
from app.compiler.optimizer.tac_generator import generate_tac
from app.compiler.parser.parser import parse


def _optimize_source(source: str):
    result = parse(source)
    assert result.errors == []
    tac = generate_tac(result.ast)
    return tac, optimize(tac)


def test_matches_the_original_demo_fixture_exactly():
    """This is the same optimization the mock fixture (Sprint 2-12)
    claimed to demonstrate -- real output must match that shape, since
    the frontend UI was designed around it."""
    before, opt = _optimize_source("int main() {\n  int x = 5;\n  return x + 2;\n}")
    assert len(before) == 3
    assert len(opt.after) == 2
    assert opt.after[0].op == "=" and opt.after[0].arg1 == "5" and opt.after[0].result == "x"
    assert opt.after[1].op == "return" and opt.after[1].arg1 == "7"
    assert opt.passes_applied == ["Constant Folding"]


def test_pure_literal_arithmetic_folds_completely():
    _before, opt = _optimize_source("int main() {\n  return 3 + 4;\n}")
    assert len(opt.after) == 1
    assert opt.after[0].op == "return"
    assert opt.after[0].arg1 == "7"


def test_chained_constant_expressions_fold_fully():
    """`2 + 3 * 4` should fold all the way down to `14`, propagating
    through both the multiplication and the addition."""
    _before, opt = _optimize_source("int main() {\n  return 2 + 3 * 4;\n}")
    assert len(opt.after) == 1
    assert opt.after[0].arg1 == "14"


def test_unfoldable_expression_with_undeclared_free_variable_is_preserved():
    """If an operand is a variable whose value isn't statically known
    (e.g. a function parameter -- not expressible in the current
    grammar, but a plain unassigned variable acts as a stand-in), the
    instruction must survive unfolded rather than being dropped or
    computing a wrong answer."""
    _before, opt = _optimize_source("int main() {\n  int x;\n  return x + 2;\n}")
    # x has no initializer, so its value is never known -- the addition
    # cannot fold and must remain in the output.
    binary_ops = [i for i in opt.after if i.op == "+"]
    assert len(binary_ops) == 1
    assert binary_ops[0].arg1 == "x"
    assert binary_ops[0].arg2 == "2"


def test_no_optimization_opportunity_reports_no_passes_applied():
    before, opt = _optimize_source("int main() {\n  int x;\n  return x;\n}")
    assert opt.passes_applied == []
    assert len(opt.after) == len(before)


def test_division_by_constant_folds():
    _before, opt = _optimize_source("int main() {\n  return 10 / 2;\n}")
    assert opt.after[0].arg1 == "5"


def test_division_by_zero_is_not_folded():
    """Folding a division by zero would either crash the optimizer or
    silently produce a nonsense value -- neither is acceptable. The
    instruction must be left unfolded rather than either."""
    _before, opt = _optimize_source("int main() {\n  return 10 / 0;\n}")
    # Should survive as a real division instruction, not fold to a bogus
    # constant or raise.
    div_ops = [i for i in opt.after if i.op == "/"]
    assert len(div_ops) == 1
