"""
Lexer correctness tests -- Testing.md Section 2.2: "table-driven tests:
given source string -> expect exact token list (type, value, line, column)."

Each fixture here is a manually-verified expectation, not something the
lexer itself generated -- these are the tests that actually catch bugs
in the lexer, not tests that just confirm the lexer agrees with itself.
"""

from app.compiler.lexer.lexer import tokenize
from app.models.compiler import TokenType


def test_keywords_vs_identifiers():
    result = tokenize("int x return y")
    types = [t.type for t in result.tokens]
    values = [t.value for t in result.tokens]
    assert types == [
        TokenType.KEYWORD,
        TokenType.IDENTIFIER,
        TokenType.KEYWORD,
        TokenType.IDENTIFIER,
    ]
    assert values == ["int", "x", "return", "y"]
    assert result.errors == []


def test_multi_char_operators_take_priority_over_single_char():
    """`==` must tokenize as one EQ operator, not `=` followed by `=`."""
    result = tokenize("a == b")
    values = [t.value for t in result.tokens]
    assert values == ["a", "==", "b"]
    assert result.tokens[1].type == TokenType.OPERATOR


def test_le_ge_not_confused_with_lt_gt_assign():
    result = tokenize("a <= b >= c")
    values = [t.value for t in result.tokens]
    assert values == ["a", "<=", "b", ">=", "c"]


def test_line_and_column_tracking_across_multiple_lines():
    source = "int x;\nint y;"
    result = tokenize(source)
    # Second line's `int` should report line=2, column=1
    second_int = result.tokens[3]
    assert second_int.value == "int"
    assert second_int.line == 2
    assert second_int.column == 1


def test_line_comment_is_tokenized_not_silently_dropped():
    result = tokenize("int x; // this is a comment\nint y;")
    comment_tokens = [t for t in result.tokens if t.type == TokenType.COMMENT]
    assert len(comment_tokens) == 1
    assert comment_tokens[0].value == "// this is a comment"


def test_block_comment_spanning_multiple_lines_advances_line_count():
    source = "int x; /* comment\nspanning lines */ int y;"
    result = tokenize(source)
    # `int y` should be recognized on line 2, since the block comment
    # contains one newline.
    tokens_after_comment = [t for t in result.tokens if t.value == "y"]
    assert tokens_after_comment[0].line == 2


def test_illegal_character_reports_lexical_error_and_skips_it():
    result = tokenize("int x = 5 @ 3;")
    assert len(result.errors) == 1
    assert "@" in result.errors[0].message
    # Lexing continues past the illegal character rather than aborting.
    assert [t.value for t in result.tokens] == ["int", "x", "=", "5", "3", ";"]


def test_multiple_illegal_characters_all_reported():
    result = tokenize("a # b $ c")
    assert len(result.errors) == 2
    assert result.errors[0].message == "Illegal character '#'."
    assert result.errors[1].message == "Illegal character '$'."


def test_integer_literal_tokenized_as_literal_type():
    result = tokenize("42")
    assert len(result.tokens) == 1
    assert result.tokens[0].type == TokenType.LITERAL
    assert result.tokens[0].value == "42"


def test_empty_source_produces_no_tokens_and_no_errors():
    result = tokenize("")
    assert result.tokens == []
    assert result.errors == []


def test_full_sample_program_matches_expected_token_sequence():
    """Same sample program as the frontend's mock fixture -- verifies the
    real lexer produces exactly the token sequence the UI was designed
    around."""
    source = "int main() {\n  int x = 5;\n  return x + 2;\n}"
    result = tokenize(source)
    values = [t.value for t in result.tokens]
    assert values == [
        "int", "main", "(", ")", "{",
        "int", "x", "=", "5", ";",
        "return", "x", "+", "2", ";",
        "}",
    ]
    assert result.errors == []
