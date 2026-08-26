"""
Real TAC (Three Address Code) generator -- Sprint 13 (Phases.md v2).

Walks the real AST (post semantic-analysis success) and emits real
three-address instructions via the standard recursive expression-walk
pattern: each sub-expression evaluates to a "place" (a variable name, a
literal value, or a freshly-allocated temporary), and each statement
emits instructions as a side effect of computing its place(s).

One temp counter per function (t1, t2, ... resets per FunctionDecl) --
matches the naming convention the frontend mock fixtures established
back in Sprint 2, so real output looks the way the UI was designed
around.

Public API: `generate_tac(ast: ASTNode) -> list[TACInstruction]`.
"""

import itertools

from app.models.compiler import ASTNode, TACInstruction


def generate_tac(ast: ASTNode) -> list[TACInstruction]:
    instructions: list[TACInstruction] = []
    instr_id_counter = itertools.count(1)
    function_decls = ast.children if ast.kind == "Program" else [ast]
    is_multi_function = len(function_decls) > 1

    for func in function_decls:
        _generate_function(func, instructions, instr_id_counter, is_multi_function)

    return instructions


def _generate_function(
    func: ASTNode,
    instructions: list[TACInstruction],
    instr_id_counter: "itertools.count[int]",
    is_multi_function: bool,
) -> None:
    func_name = (func.metadata or {}).get("name", "unknown")
    temp_counter = itertools.count(1)

    # Function-boundary label. Not currently rendered by the frontend's
    # TAC table (Op/Arg1/Arg2/Result columns only, per Sprint 6) --
    # available in the data now, surfaced in the UI later if needed.
    # Only emitted for multi-function programs so single-function output
    # (the common case) stays exactly as clean as the original demo
    # fixture's shape.
    if is_multi_function:
        instructions.append(
            TACInstruction(id=f"i{next(instr_id_counter)}", op="label", label=func_name)
        )

    for stmt in func.children:
        _generate_stmt(stmt, instructions, instr_id_counter, temp_counter)


def _generate_stmt(
    stmt: ASTNode,
    instructions: list[TACInstruction],
    instr_id_counter: "itertools.count[int]",
    temp_counter: "itertools.count[int]",
) -> None:
    if stmt.kind == "VarDecl" or stmt.kind == "AssignStatement":
        name = (stmt.metadata or {}).get("name")
        if stmt.children:
            place = _generate_expr(stmt.children[0], instructions, instr_id_counter, temp_counter)
            instructions.append(
                TACInstruction(id=f"i{next(instr_id_counter)}", op="=", arg1=place, result=name)
            )

    elif stmt.kind == "ReturnStatement":
        place = None
        if stmt.children:
            place = _generate_expr(stmt.children[0], instructions, instr_id_counter, temp_counter)
        instructions.append(
            TACInstruction(id=f"i{next(instr_id_counter)}", op="return", arg1=place)
        )


def _generate_expr(
    node: ASTNode,
    instructions: list[TACInstruction],
    instr_id_counter: "itertools.count[int]",
    temp_counter: "itertools.count[int]",
) -> str:
    if node.kind == "Literal":
        return (node.metadata or {}).get("value", "")

    if node.kind == "Identifier":
        return (node.metadata or {}).get("name", "")

    if node.kind == "BinaryExpr":
        left_place = _generate_expr(node.children[0], instructions, instr_id_counter, temp_counter)
        right_place = _generate_expr(
            node.children[1], instructions, instr_id_counter, temp_counter
        )
        operator = (node.metadata or {}).get("operator", "?")
        temp = f"t{next(temp_counter)}"
        instructions.append(
            TACInstruction(
                id=f"i{next(instr_id_counter)}",
                op=operator,
                arg1=left_place,
                arg2=right_place,
                result=temp,
            )
        )
        return temp

    # Unreachable with the current grammar (Sprint 11) -- every
    # expression node kind the parser produces is handled above.
    raise ValueError(f"Unsupported expression node kind for TAC generation: {node.kind}")
