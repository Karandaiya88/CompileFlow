"""/grammar endpoint -- API-spec.md Section 4."""

from fastapi import APIRouter, HTTPException

from app.models.compiler import GrammarDefinition, GrammarProduction

router = APIRouter()

_C_LIKE_GRAMMAR = GrammarDefinition(
    id="c-like-v1",
    name="C-Like Subset Grammar",
    productions=[
        GrammarProduction(lhs="Program", rhs=["FunctionDecl*"]),
        GrammarProduction(
            lhs="FunctionDecl",
            rhs=["Type", "IDENTIFIER", "(", "ParamList", ")", "Block"],
        ),
        GrammarProduction(lhs="Block", rhs=["{", "Statement*", "}"]),
        GrammarProduction(lhs="Statement", rhs=["VarDecl", ";"]),
        GrammarProduction(lhs="Statement", rhs=["ReturnStatement", ";"]),
        GrammarProduction(lhs="ReturnStatement", rhs=["return", "Expression"]),
        GrammarProduction(lhs="Expression", rhs=["Expression", "+", "Term"]),
        GrammarProduction(lhs="Expression", rhs=["Term"]),
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
