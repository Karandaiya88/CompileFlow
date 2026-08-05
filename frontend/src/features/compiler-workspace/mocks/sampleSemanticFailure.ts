import type { CompilationResult } from '@/types/compiler';

/**
 * Traced from: `int main() { return undeclared_demo + 1; }`
 * Demonstrates a phase-tagged failure surfaced at the semantic stage,
 * per SystemDesign.md Section 5 (Error Handling Model).
 */
export const sampleSemanticFailure: CompilationResult = {
  status: 'failed',
  failedAtPhase: 'semantic',
  tokens: [
    { id: 't1', type: 'KEYWORD', value: 'int', line: 1, column: 1 },
    { id: 't2', type: 'IDENTIFIER', value: 'main', line: 1, column: 5 },
    { id: 't3', type: 'PUNCTUATION', value: '(', line: 1, column: 9 },
    { id: 't4', type: 'PUNCTUATION', value: ')', line: 1, column: 10 },
    { id: 't5', type: 'PUNCTUATION', value: '{', line: 1, column: 12 },
    { id: 't6', type: 'KEYWORD', value: 'return', line: 1, column: 14 },
    { id: 't7', type: 'IDENTIFIER', value: 'undeclared_demo', line: 1, column: 21 },
    { id: 't8', type: 'OPERATOR', value: '+', line: 1, column: 37 },
    { id: 't9', type: 'LITERAL', value: '1', line: 1, column: 39 },
    { id: 't10', type: 'PUNCTUATION', value: ';', line: 1, column: 40 },
    { id: 't11', type: 'PUNCTUATION', value: '}', line: 1, column: 42 },
  ],
  ast: {
    id: 'n1',
    kind: 'FunctionDecl',
    line: 1,
    metadata: { name: 'main', returnType: 'int' },
    children: [
      {
        id: 'n2',
        kind: 'ReturnStatement',
        line: 1,
        children: [
          {
            id: 'n3',
            kind: 'BinaryExpr',
            line: 1,
            metadata: { operator: '+' },
            children: [
              {
                id: 'n4',
                kind: 'Identifier',
                line: 1,
                metadata: { name: 'undeclared_demo' },
                children: [],
              },
              { id: 'n5', kind: 'Literal', line: 1, metadata: { value: '1' }, children: [] },
            ],
          },
        ],
      },
    ],
  },
  symbolTable: [],
  diagnostics: [
    {
      severity: 'error',
      message: "Undeclared variable 'undeclared_demo' used in expression.",
      line: 1,
      phase: 'semantic',
    },
  ],
  tac: [],
  optimization: null,
  assembly: [],
};
