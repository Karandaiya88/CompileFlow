"""/grammar endpoint -- API-spec.md Section 4.

Sprint 11: productions below now match app/compiler/parser/parser.py's
real grammar exactly (previously this was Sprint 9's placeholder, a
smaller grammar than what's actually implemented)."""

from fastapi import APIRouter, HTTPException

from app.models.compiler import GrammarDefinition, GrammarProduction

router = APIRouter()

_C_LIKE_GRAMMAR = GrammarDefinition(
    id="c-like-v1",
    name="C-Like Subset Grammar",
    productions=[
        GrammarProduction(lhs="program", rhs=["func_decl_list"]),
        GrammarProduction(lhs="func_decl_list", rhs=["func_decl_list", "func_decl"]),
        GrammarProduction(lhs="func_decl_list", rhs=["func_decl"]),
        GrammarProduction(
            lhs="func_decl",
            rhs=["type_spec", "IDENTIFIER", "(", ")", "{", "stmt_list", "}"],
        ),
        GrammarProduction(lhs="type_spec", rhs=["int", "|", "float", "|", "char", "|", "void"]),
        GrammarProduction(lhs="stmt_list", rhs=["stmt_list", "stmt"]),
        GrammarProduction(lhs="stmt_list", rhs=["stmt", "|", "ε"]),
        GrammarProduction(lhs="stmt", rhs=["var_decl", ";"]),
        GrammarProduction(lhs="stmt", rhs=["assign_stmt", ";"]),
        GrammarProduction(lhs="stmt", rhs=["return_stmt", ";"]),
        GrammarProduction(lhs="var_decl", rhs=["type_spec", "IDENTIFIER", "=", "expr"]),
        GrammarProduction(lhs="var_decl", rhs=["type_spec", "IDENTIFIER"]),
        GrammarProduction(lhs="assign_stmt", rhs=["IDENTIFIER", "=", "expr"]),
        GrammarProduction(lhs="return_stmt", rhs=["return", "expr"]),
        GrammarProduction(
            lhs="expr",
            rhs=["expr", "+", "expr", "|", "expr", "-", "expr", "|", "expr", "*", "expr", "|", "expr", "/", "expr"],
        ),
        GrammarProduction(lhs="expr", rhs=["(", "expr", ")"]),
        GrammarProduction(lhs="expr", rhs=["IDENTIFIER", "|", "NUMBER"]),
    ],
    sampleProgram="int main() {\n  int x = 5;\n  return x + 2;\n}",
)

_GRAMMARS = {_C_LIKE_GRAMMAR.id: _C_LIKE_GRAMMAR}


@router.get("/grammar/{grammar_id}", response_model=GrammarDefinition)
def get_grammar(grammar_id: str) -> GrammarDefinition:
    grammar = _GRAMMARS.get(grammar_id)
    if grammar is None:
        raise HTTPException(status_code=404, detail=f'No grammar registered for id "{grammar_id}".')
    return grammar
