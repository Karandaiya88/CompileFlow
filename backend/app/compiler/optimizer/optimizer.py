"""
Real optimizer -- Sprint 13 (Phases.md v2).

Implements Constant Folding with forward constant propagation: a single
forward pass over straight-line TAC (no branches exist in the grammar
yet, so no control-flow graph is needed for this to be correct) that
tracks which places currently hold a known compile-time constant value,
folds any binary operation whose operands are both known constants
(dropping the instruction entirely -- its result is substituted wherever
referenced later), and rewrites operands of surviving instructions to
their resolved constant values where possible.

This is deliberately the same optimization the original mock fixture
(Sprint 2-12) claimed to demonstrate -- `x = 5; return x + 2;` folding to
`x = 5; return 7;` -- so real output validates against the shape the UI
was designed around, not a new shape that happens to also be "an
optimization."

Public API: `optimize(tac: list[TACInstruction]) -> OptimizationResult`.
"""

import itertools
from dataclasses import dataclass, field

from app.models.compiler import TACInstruction


def _as_int(value: str | None) -> int | None:
    if value is None:
        return None
    try:
        return int(value)
    except ValueError:
        return None


_BINARY_OPS = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: a // b if b != 0 else None,
}


@dataclass
class OptimizationResult:
    after: list[TACInstruction] = field(default_factory=list)
    passes_applied: list[str] = field(default_factory=list)


def optimize(tac: list[TACInstruction]) -> OptimizationResult:
    known_constants: dict[str, int] = {}
    after: list[TACInstruction] = []
    out_id_counter = itertools.count(1)
    folded_anything = False

    def resolve(place: str | None) -> str | None:
        """If `place` is a literal int already, or a variable/temp with a
        known constant value, return the resolved literal string.
        Otherwise return the original place unchanged (e.g. an
        un-folded variable)."""
        if place is None:
            return None
        literal = _as_int(place)
        if literal is not None:
            return place
        if place in known_constants:
            return str(known_constants[place])
        return place

    for instr in tac:
        if instr.op == "=" and instr.arg1 is not None:
            resolved_arg1 = resolve(instr.arg1)
            value = _as_int(resolved_arg1)
            if value is not None and instr.result:
                known_constants[instr.result] = value
            after.append(
                TACInstruction(
                    id=f"o{next(out_id_counter)}",
                    op="=",
                    arg1=resolved_arg1,
                    result=instr.result,
                )
            )

        elif instr.op in _BINARY_OPS and instr.arg1 is not None and instr.arg2 is not None:
            left = _as_int(resolve(instr.arg1))
            right = _as_int(resolve(instr.arg2))
            if left is not None and right is not None:
                computed = _BINARY_OPS[instr.op](left, right)
                if computed is not None:
                    if instr.result:
                        known_constants[instr.result] = computed
                    folded_anything = True
                    continue  # instruction fully folded away, don't emit it
            # Not fully foldable (e.g. one operand is a genuinely unknown
            # variable) -- keep the instruction but with resolved operands.
            resolved_arg1 = resolve(instr.arg1)
            resolved_arg2 = resolve(instr.arg2)
            if resolved_arg1 != instr.arg1 or resolved_arg2 != instr.arg2:
                folded_anything = True
            after.append(
                TACInstruction(
                    id=f"o{next(out_id_counter)}",
                    op=instr.op,
                    arg1=resolved_arg1,
                    arg2=resolved_arg2,
                    result=instr.result,
                )
            )

        elif instr.op == "return":
            resolved_arg1 = resolve(instr.arg1)
            if resolved_arg1 != instr.arg1:
                folded_anything = True
            after.append(
                TACInstruction(id=f"o{next(out_id_counter)}", op="return", arg1=resolved_arg1)
            )

        else:
            # label, or anything else not subject to constant folding --
            # passed through unchanged.
            after.append(
                TACInstruction(
                    id=f"o{next(out_id_counter)}",
                    op=instr.op,
                    arg1=instr.arg1,
                    arg2=instr.arg2,
                    result=instr.result,
                    label=instr.label,
                )
            )

    return OptimizationResult(
        after=after,
        passes_applied=["Constant Folding"] if folded_anything else [],
    )
