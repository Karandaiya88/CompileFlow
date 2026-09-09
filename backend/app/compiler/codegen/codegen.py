"""
Real target codegen -- Sprint 14 (Phases.md v2). The final compiler phase.

Translates optimized TAC into a simplified x86-style assembly listing:
every value (variable or temp) lives in a flat pseudo-memory slot
addressed by name (`[x]`, `[t1]`), with EAX as the sole working
register -- no real register allocation, no stack frames, no calling
convention. This is a deliberate simplification appropriate for an
educational visualizer, not a real x86 backend; documented here rather
than silently implied to be more than it is.

Public API: `generate_assembly(tac: list[TACInstruction]) -> list[AssemblyLine]`.
Operates on the *optimized* TAC (post app.compiler.optimizer.optimizer),
matching the natural pipeline order: codegen consumes the final IR.
"""

from app.models.compiler import AssemblyLine, TACInstruction

_ARITH_MNEMONIC = {
    "+": "ADD",
    "-": "SUB",
    "*": "IMUL",
    "/": "IDIV",
}


def _as_int(value: str | None) -> int | None:
    if value is None:
        return None
    try:
        return int(value)
    except ValueError:
        return None


def _operand(value: str | None) -> str:
    """Numeric literals become immediates; anything else (a variable or
    temp name) becomes a pseudo-memory reference."""
    if _as_int(value) is not None:
        return value
    return f"[{value}]"


def generate_assembly(tac: list[TACInstruction]) -> list[AssemblyLine]:
    lines: list[AssemblyLine] = []

    for instr in tac:
        if instr.op == "label":
            lines.append(AssemblyLine(instruction=f"{instr.label}:", operands=[]))

        elif instr.op == "=" and instr.result:
            lines.append(AssemblyLine(instruction="MOV", operands=["EAX", _operand(instr.arg1)]))
            lines.append(AssemblyLine(instruction="MOV", operands=[f"[{instr.result}]", "EAX"]))

        elif instr.op in _ARITH_MNEMONIC and instr.result:
            lines.append(AssemblyLine(instruction="MOV", operands=["EAX", _operand(instr.arg1)]))
            lines.append(
                AssemblyLine(
                    instruction=_ARITH_MNEMONIC[instr.op],
                    operands=["EAX", _operand(instr.arg2)],
                )
            )
            lines.append(AssemblyLine(instruction="MOV", operands=[f"[{instr.result}]", "EAX"]))

        elif instr.op == "return":
            if instr.arg1 is not None:
                lines.append(
                    AssemblyLine(instruction="MOV", operands=["EAX", _operand(instr.arg1)])
                )
            lines.append(AssemblyLine(instruction="RET", operands=[]))

    return lines
