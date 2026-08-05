import type { GrammarDefinition } from '@/types/compiler';

export const cLikeGrammar: GrammarDefinition = {
  id: 'c-like-v1',
  name: 'C-Like Subset Grammar',
  productions: [
    { lhs: 'Program', rhs: ['FunctionDecl*'] },
    { lhs: 'FunctionDecl', rhs: ['Type', 'IDENTIFIER', '(', 'ParamList', ')', 'Block'] },
    { lhs: 'Block', rhs: ['{', 'Statement*', '}'] },
    { lhs: 'Statement', rhs: ['VarDecl', ';'] },
    { lhs: 'Statement', rhs: ['ReturnStatement', ';'] },
    { lhs: 'ReturnStatement', rhs: ['return', 'Expression'] },
    { lhs: 'Expression', rhs: ['Expression', '+', 'Term'] },
    { lhs: 'Expression', rhs: ['Term'] },
  ],
  sampleProgram: 'int main() {\n  int x = 5;\n  return x + 2;\n}',
};
