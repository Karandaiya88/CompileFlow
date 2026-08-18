"""
Real parser -- Sprint 11 (Phases.md v2).

Built on PLY (ply.yacc), consuming tokens from app.compiler.lexer.lexer.
Grammar covers function declarations (no parameters yet -- documented
limitation below), variable declarations with optional initializers,
assignment statements, return statements, and a standard precedence-
climbing arithmetic expression grammar (+ - * / with parentheses).

This grammar is intentionally broader than SystemDesign.md's original
`cLikeGrammar` fixture (which only had `int`/`return`/`+`) -- the Grammar
Library page's productions should be updated to match this real grammar
in a follow-up (tracked as a known gap below, not silently diverged).

Public API: `parse(source: str) -> ParseResult`, returning either a real
ASTNode tree or a list of syntax errors, so pipeline.py can decide
success vs. syntax-phase failure.
"""

import itertools
from dataclasses import dataclass, field

from ply import yacc

from app.compiler.lexer.lexer import (  # noqa: F401 -- yacc needs `tokens` in scope
    lexer,
    tokens,
)
from app.models.compiler import ASTNode

precedence = (
    ("left", "PLUS", "MINUS"),
    ("left", "TIMES", "DIVIDE"),
)

_node_id_counter = itertools.count(1)


def _new_id() -> str:
    return f"n{next(_node_id_counter)}"


def _node(kind: str, line: int, children: list[ASTNode] | None = None, **metadata) -> ASTNode:
    return ASTNode(
        id=_new_id(),
        kind=kind,
        line=line,
        children=children or [],
        metadata=metadata or None,
    )


# --- Grammar rules -----------------------------------------------------


def p_program(p):
    """program : func_decl_list"""
    if len(p[1]) == 1:
        p[0] = p[1][0]
    else:
        p[0] = _node("Program", p[1][0].line, children=p[1])


def p_func_decl_list_multi(p):
    """func_decl_list : func_decl_list func_decl"""
    p[0] = [*p[1], p[2]]


def p_func_decl_list_single(p):
    """func_decl_list : func_decl"""
    p[0] = [p[1]]


def p_func_decl(p):
    """func_decl : type_spec IDENTIFIER LPAREN RPAREN LBRACE stmt_list RBRACE"""
    p[0] = _node(
        "FunctionDecl",
        p.lineno(2),
        children=p[6],
        name=p[2],
        returnType=p[1],
    )


def p_type_spec(p):
    """type_spec : INT
    | FLOAT
    | CHAR
    | VOID"""
    p[0] = p[1]


def p_stmt_list_multi(p):
    """stmt_list : stmt_list stmt"""
    p[0] = [*p[1], p[2]]


def p_stmt_list_single(p):
    """stmt_list : stmt"""
    p[0] = [p[1]]


def p_stmt_list_empty(p):
    """stmt_list : empty"""
    p[0] = []


def p_empty(p):
    """empty :"""


def p_stmt_var_decl(p):
    """stmt : var_decl SEMI"""
    p[0] = p[1]


def p_stmt_assign(p):
    """stmt : assign_stmt SEMI"""
    p[0] = p[1]


def p_stmt_return(p):
    """stmt : return_stmt SEMI"""
    p[0] = p[1]


def p_var_decl_with_init(p):
    """var_decl : type_spec IDENTIFIER ASSIGN expr"""
    p[0] = _node("VarDecl", p.lineno(2), children=[p[4]], name=p[2], varType=p[1])


def p_var_decl_no_init(p):
    """var_decl : type_spec IDENTIFIER"""
    p[0] = _node("VarDecl", p.lineno(2), children=[], name=p[2], varType=p[1])


def p_assign_stmt(p):
    """assign_stmt : IDENTIFIER ASSIGN expr"""
    p[0] = _node("AssignStatement", p.lineno(1), children=[p[3]], name=p[1])


def p_return_stmt(p):
    """return_stmt : RETURN expr"""
    p[0] = _node("ReturnStatement", p.lineno(1), children=[p[2]])


def p_expr_binop(p):
    """expr : expr PLUS expr
    | expr MINUS expr
    | expr TIMES expr
    | expr DIVIDE expr"""
    p[0] = _node("BinaryExpr", p[1].line, children=[p[1], p[3]], operator=p[2])


def p_expr_group(p):
    """expr : LPAREN expr RPAREN"""
    p[0] = p[2]


def p_expr_identifier(p):
    """expr : IDENTIFIER"""
    p[0] = _node("Identifier", p.lineno(1), name=p[1])


def p_expr_number(p):
    """expr : NUMBER"""
    p[0] = _node("Literal", p.lineno(1), value=p[1])


@dataclass
class SyntaxErrorInfo:
    message: str
    line: int


@dataclass
class ParseResult:
    ast: ASTNode | None = None
    errors: list[SyntaxErrorInfo] = field(default_factory=list)


_pending_syntax_errors: list[SyntaxErrorInfo] = []


def p_error(p):
    if p is None:
        _pending_syntax_errors.append(
            SyntaxErrorInfo(message="Unexpected end of input.", line=-1)
        )
    else:
        _pending_syntax_errors.append(
            SyntaxErrorInfo(message=f"Syntax error near '{p.value}'.", line=p.lineno)
        )


_parser = yacc.yacc(debug=False, write_tables=False)


def _make_comment_filtering_tokenfunc():
    """The grammar has no production for COMMENT tokens -- no C-like
    grammar does; comments are structurally invisible to parsing. But
    lexer.tokenize() (used by the Token Viewer) must still emit them.
    Rather than have the lexer drop comments entirely (which would break
    that), filter them out only on the parser's side via a custom token
    supplier."""

    def _next_token():
        while True:
            tok = lexer.token()
            if tok is None or tok.type != "COMMENT":
                return tok

    return _next_token


def parse(source: str) -> ParseResult:
    """Known limitation, same as the lexer (lexer.py's tokenize() docstring):
    module-level parser/lexer state, reset per call, not safe for true
    request concurrency at this project's current scale."""
    _pending_syntax_errors.clear()
    lexer.lineno = 1
    lexer.input(source)
    ast = _parser.parse(lexer=lexer, tokenfunc=_make_comment_filtering_tokenfunc())

    result = ParseResult()
    if _pending_syntax_errors:
        result.errors = list(_pending_syntax_errors)
    else:
        result.ast = ast
    return result
