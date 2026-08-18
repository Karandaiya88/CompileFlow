import type { GrammarDefinition } from '@/types/compiler';

/**
 * Kept in sync with the real backend grammar (Sprint 11):
 * backend/app/compiler/parser/parser.py + backend/app/routers/grammar.py.
 * Update both sides together if the grammar changes.
 */
export const cLikeGrammar: GrammarDefinition = {
  id: 'c-like-v1',
  name: 'C-Like Subset Grammar',
  productions: [
    { lhs: 'program', rhs: ['func_decl_list'] },
    { lhs: 'func_decl_list', rhs: ['func_decl_list', 'func_decl'] },
    { lhs: 'func_decl_list', rhs: ['func_decl'] },
    { lhs: 'func_decl', rhs: ['type_spec', 'IDENTIFIER', '(', ')', '{', 'stmt_list', '}'] },
    { lhs: 'type_spec', rhs: ['int', '|', 'float', '|', 'char', '|', 'void'] },
    { lhs: 'stmt_list', rhs: ['stmt_list', 'stmt'] },
    { lhs: 'stmt_list', rhs: ['stmt', '|', 'ε'] },
    { lhs: 'stmt', rhs: ['var_decl', ';'] },
    { lhs: 'stmt', rhs: ['assign_stmt', ';'] },
    { lhs: 'stmt', rhs: ['return_stmt', ';'] },
    { lhs: 'var_decl', rhs: ['type_spec', 'IDENTIFIER', '=', 'expr'] },
    { lhs: 'var_decl', rhs: ['type_spec', 'IDENTIFIER'] },
    { lhs: 'assign_stmt', rhs: ['IDENTIFIER', '=', 'expr'] },
    { lhs: 'return_stmt', rhs: ['return', 'expr'] },
    {
      lhs: 'expr',
      rhs: ['expr', '+', 'expr', '|', 'expr', '-', 'expr', '|', 'expr', '*', 'expr', '|', 'expr', '/', 'expr'],
    },
    { lhs: 'expr', rhs: ['(', 'expr', ')'] },
    { lhs: 'expr', rhs: ['IDENTIFIER', '|', 'NUMBER'] },
  ],
  sampleProgram: 'int main() {\n  int x = 5;\n  return x + 2;\n}',
};
