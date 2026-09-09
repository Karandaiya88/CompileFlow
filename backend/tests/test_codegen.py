"""
Codegen correctness tests -- Testing.md Section 2.2: "given optimized TAC
-> expect exact assembly-like output for a fixed instruction set."
"""

from app.compiler.codegen.codegen import generate_assembly
from app.compiler.optimizer.optimizer import optimize
from app.compiler.optimizer.tac_generator import generate_tac
from app.compiler.parser.parser import parse


def _assembly(source: str):
    result = parse(source)
    assert result.errors == []
    tac = generate_tac(result.ast)
    opt = optimize(tac)
    return generate_assembly(opt.after)


def test_matches_the_original_demo_fixture_exactly():
    """Same program the mock fixture (Sprint 2-13) always claimed to
    produce this exact assembly for -- real output must match."""
    asm = _assembly("int main() {\n  int x = 5;\n  return x + 2;\n}")
    shape = [(line.instruction, line.operands) for line in asm]
    assert shape == [
        ("MOV", ["EAX", "5"]),
        ("MOV", ["[x]", "EAX"]),
        ("MOV", ["EAX", "7"]),
        ("RET", []),
    ]


def test_unfoldable_binary_expression_generates_arithmetic_instruction():
    """A variable whose value isn't statically known (no initializer)
    can't be folded -- codegen must emit a real ADD instruction, not
    silently drop the computation."""
    asm = _assembly("int main() {\n  int x;\n  return x + 2;\n}")
    add_lines = [line for line in asm if line.instruction == "ADD"]
    assert len(add_lines) == 1
    assert add_lines[0].operands == ["EAX", "2"]


def test_variable_reference_uses_bracket_memory_syntax():
    asm = _assembly("int main() {\n  int x;\n  int y = x;\n  return y;\n}")
    # `y = x` should MOV EAX, [x] (x is a name, not a literal).
    mov_from_x = [line for line in asm if line.operands == ["EAX", "[x]"]]
    assert len(mov_from_x) == 1


def test_multi_function_program_emits_labels():
    asm = _assembly("int foo() { return 1; } int bar() { return 2; }")
    labels = [line.instruction for line in asm if line.instruction.endswith(":")]
    assert labels == ["foo:", "bar:"]


def test_return_with_no_expression_only_emits_ret():
    """Grammar note: return always requires an expression currently
    (Sprint 11), so this exercises the defensive branch directly rather
    than via a parseable program."""
    from app.models.compiler import TACInstruction

    asm = generate_assembly([TACInstruction(id="i1", op="return", arg1=None)])
    assert len(asm) == 1
    assert asm[0].instruction == "RET"


def test_division_generates_idiv_mnemonic():
    asm = _assembly("int main() {\n  int x;\n  return x / 2;\n}")
    assert any(line.instruction == "IDIV" for line in asm)
