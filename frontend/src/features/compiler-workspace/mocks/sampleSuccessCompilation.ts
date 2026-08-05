import type { CompilationResult } from '@/types/compiler';

/**
 * Traced manually from: `int main() { int x = 5; return x + 2; }`
 * Per Rules.md 4.5 and SystemDesign.md Section 6 -- fixtures must be
 * derived from real, verified compilation traces, not invented data.
 */
export const sampleSuccessCompilation: CompilationResult = {
  status: 'success',
  tokens: [
    { id: 't1', type: 'KEYWORD', value: 'int', line: 1, column: 1 },
    { id: 't2', type: 'IDENTIFIER', value: 'main', line: 1, column: 5 },
    { id: 't3', type: 'PUNCTUATION', value: '(', line: 1, column: 9 },
    { id: 't4', type: 'PUNCTUATION', value: ')', line: 1, column: 10 },
    { id: 't5', type: 'PUNCTUATION', value: '{', line: 1, column: 12 },
    { id: 't6', type: 'KEYWORD', value: 'int', line: 1, column: 14 },
    { id: 't7', type: 'IDENTIFIER', value: 'x', line: 1, column: 18 },
    { id: 't8', type: 'OPERATOR', value: '=', line: 1, column: 20 },
    { id: 't9', type: 'LITERAL', value: '5', line: 1, column: 22 },
    { id: 't10', type: 'PUNCTUATION', value: ';', line: 1, column: 23 },
    { id: 't11', type: 'KEYWORD', value: 'return', line: 1, column: 25 },
    { id: 't12', type: 'IDENTIFIER', value: 'x', line: 1, column: 32 },
    { id: 't13', type: 'OPERATOR', value: '+', line: 1, column: 34 },
    { id: 't14', type: 'LITERAL', value: '2', line: 1, column: 36 },
    { id: 't15', type: 'PUNCTUATION', value: ';', line: 1, column: 37 },
    { id: 't16', type: 'PUNCTUATION', value: '}', line: 1, column: 39 },
  ],
  ast: {
    id: 'n1',
    kind: 'FunctionDecl',
    line: 1,
    metadata: { name: 'main', returnType: 'int' },
    children: [
      {
        id: 'n2',
        kind: 'VarDecl',
        line: 1,
        metadata: { name: 'x', varType: 'int' },
        children: [{ id: 'n3', kind: 'Literal', line: 1, metadata: { value: '5' }, children: [] }],
      },
      {
        id: 'n4',
        kind: 'ReturnStatement',
        line: 1,
        children: [
          {
            id: 'n5',
            kind: 'BinaryExpr',
            line: 1,
            metadata: { operator: '+' },
            children: [
              { id: 'n6', kind: 'Identifier', line: 1, metadata: { name: 'x' }, children: [] },
              { id: 'n7', kind: 'Literal', line: 1, metadata: { value: '2' }, children: [] },
            ],
          },
        ],
      },
    ],
  },
  symbolTable: [{ name: 'x', type: 'int', scope: 'main', declaredAt: 1 }],
  diagnostics: [],
  tac: [
    { id: 'i1', op: '=', arg1: '5', result: 'x' },
    { id: 'i2', op: '+', arg1: 'x', arg2: '2', result: 't1' },
    { id: 'i3', op: 'return', arg1: 't1' },
  ],
  optimization: {
    before: [
      { id: 'i1', op: '=', arg1: '5', result: 'x' },
      { id: 'i2', op: '+', arg1: 'x', arg2: '2', result: 't1' },
      { id: 'i3', op: 'return', arg1: 't1' },
    ],
    after: [
      { id: 'i1b', op: '=', arg1: '5', result: 'x' },
      { id: 'i2b', op: 'return', arg1: '7' },
    ],
    passesApplied: ['Constant Folding'],
  },
  assembly: [
    { instruction: 'MOV', operands: ['EAX', '5'] },
    { instruction: 'MOV', operands: ['[x]', 'EAX'] },
    { instruction: 'MOV', operands: ['EAX', '7'], comment: 'folded x + 2 -> 7' },
    { instruction: 'RET', operands: [] },
  ],
};
