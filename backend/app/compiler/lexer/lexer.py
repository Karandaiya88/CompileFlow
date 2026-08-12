"""
Real lexer -- Sprint 10 (Phases.md v2).

Built on PLY (ply.lex), per PRD.md's tech stack. Tokenizes the C-like
subset: keywords, identifiers, integer literals, arithmetic/comparison
operators, punctuation, and both comment styles.

Scope note: the lexer recognizes a slightly larger keyword/operator set
than the grammar in GrammarLibrary currently defines (SystemDesign.md's
cLikeGrammar only covers `int`/`return`/`+` so far) -- that's intentional
and normal: a lexer is commonly built ahead of the parser it will feed.
The parser (Sprint 11) grows into this token set; it doesn't need to
consume all of it immediately.

Public API: `tokenize(source: str) -> LexResult`, returning both the
token list (in frontend Token shape) and any lexical errors found, so
the caller (pipeline.py) can decide success vs. lexical-phase failure.
"""

from dataclasses import dataclass, field

from ply import lex

from app.models.compiler import Token, TokenType

KEYWORDS = {
    "int",
    "float",
    "char",
    "void",
    "return",
    "if",
    "else",
    "while",
    "for",
}

tokens = (
    "KEYWORD",
    "IDENTIFIER",
    "NUMBER",
    "EQ",
    "NEQ",
    "LE",
    "GE",
    "LT",
    "GT",
    "ASSIGN",
    "PLUS",
    "MINUS",
    "TIMES",
    "DIVIDE",
    "LPAREN",
    "RPAREN",
    "LBRACE",
    "RBRACE",
    "SEMI",
    "COMMENT",
)

# Longest-match-first ordering matters for multi-char operators.
t_EQ = r"=="
t_NEQ = r"!="
t_LE = r"<="
t_GE = r">="
t_LT = r"<"
t_GT = r">"
t_ASSIGN = r"="
t_PLUS = r"\+"
t_MINUS = r"-"
t_TIMES = r"\*"
t_DIVIDE = r"/"
t_LPAREN = r"\("
t_RPAREN = r"\)"
t_LBRACE = r"\{"
t_RBRACE = r"\}"
t_SEMI = r";"

t_ignore = " \t"


def t_COMMENT(t):
    r"(//[^\n]*)|(/\*(.|\n)*?\*/)"
    t.lexer.lineno += t.value.count("\n")
    return t


def t_IDENTIFIER(t):
    r"[a-zA-Z_][a-zA-Z0-9_]*"
    t.type = "KEYWORD" if t.value in KEYWORDS else "IDENTIFIER"
    return t


def t_NUMBER(t):
    r"\d+"
    return t


def t_newline(t):
    r"\n+"
    t.lexer.lineno += len(t.value)


@dataclass
class LexError:
    message: str
    line: int
    column: int


@dataclass
class LexResult:
    tokens: list[Token] = field(default_factory=list)
    errors: list[LexError] = field(default_factory=list)


def _column(source: str, lexpos: int) -> int:
    """PLY gives absolute lexpos, not line-relative column -- compute it
    from the last newline before this position."""
    last_newline = source.rfind("\n", 0, lexpos)
    return lexpos - last_newline if last_newline >= 0 else lexpos + 1


_TOKEN_TYPE_MAP = {
    "KEYWORD": TokenType.KEYWORD,
    "IDENTIFIER": TokenType.IDENTIFIER,
    "NUMBER": TokenType.LITERAL,
    "COMMENT": TokenType.COMMENT,
    "EQ": TokenType.OPERATOR,
    "NEQ": TokenType.OPERATOR,
    "LE": TokenType.OPERATOR,
    "GE": TokenType.OPERATOR,
    "LT": TokenType.OPERATOR,
    "GT": TokenType.OPERATOR,
    "ASSIGN": TokenType.OPERATOR,
    "PLUS": TokenType.OPERATOR,
    "MINUS": TokenType.OPERATOR,
    "TIMES": TokenType.OPERATOR,
    "DIVIDE": TokenType.OPERATOR,
    "LPAREN": TokenType.PUNCTUATION,
    "RPAREN": TokenType.PUNCTUATION,
    "LBRACE": TokenType.PUNCTUATION,
    "RBRACE": TokenType.PUNCTUATION,
    "SEMI": TokenType.PUNCTUATION,
}


_pending_errors: list["LexError"] = []


def t_error(t):
    _pending_errors.append(
        LexError(message=f"Illegal character '{t.value[0]}'.", line=t.lineno, column=t.lexpos)
    )
    t.lexer.skip(1)


_lexer = lex.lex()


def tokenize(source: str) -> LexResult:
    result = LexResult()
    _pending_errors.clear()

    # PLY lexer state (lineno/lexpos) must be reset explicitly -- it's
    # not a fresh lexer per call. Known limitation: this module-level
    # lexer is not safe for truly concurrent requests (two compiles at
    # the exact same instant could interleave state). Acceptable for
    # this project's scale; a per-request lexer instance would need the
    # dynamic-module trick, which breaks PLY's function-signature
    # introspection when functions become bound methods -- not worth the
    # complexity here.
    _lexer.lineno = 1
    _lexer.input(source)

    for idx, tok in enumerate(_lexer, start=1):
        result.tokens.append(
            Token(
                id=f"t{idx}",
                type=_TOKEN_TYPE_MAP[tok.type],
                value=tok.value,
                line=tok.lineno,
                column=_column(source, tok.lexpos),
            )
        )

    for err in _pending_errors:
        err.column = _column(source, err.column)
    result.errors = list(_pending_errors)
    return result
