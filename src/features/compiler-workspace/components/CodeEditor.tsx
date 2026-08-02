import Editor, { type OnMount } from '@monaco-editor/react';
import { useWorkspaceStore } from '../store/workspaceStore';

/**
 * Custom Monaco theme matching Design.md Section 7:
 * "Custom theme matching --bg-surface background, synced to phase-colors
 * for inline diagnostic squiggles."
 */
function defineSmartCCTheme(monaco: Parameters<OnMount>[1]) {
  monaco.editor.defineTheme('smartcc-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'BC8CFF' },
      { token: 'identifier', foreground: 'EDEDEF' },
      { token: 'number', foreground: '58A6FF' },
      { token: 'string', foreground: '3FB950' },
      { token: 'comment', foreground: '5C5C61', fontStyle: 'italic' },
      { token: 'operator', foreground: 'D29922' },
    ],
    colors: {
      'editor.background': '#131316',
      'editor.lineHighlightBackground': '#1C1C1F',
      'editorLineNumber.foreground': '#5C5C61',
      'editorLineNumber.activeForeground': '#A1A1A6',
      'editor.selectionBackground': '#5E6AD255',
      'editorCursor.foreground': '#5E6AD2',
      'editorGutter.background': '#131316',
    },
  });
}

export function CodeEditor() {
  const sourceCode = useWorkspaceStore((s) => s.sourceCode);
  const setSourceCode = useWorkspaceStore((s) => s.setSourceCode);

  const handleMount: OnMount = (_editor, monaco) => {
    defineSmartCCTheme(monaco);
    monaco.editor.setTheme('smartcc-dark');
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="c"
      value={sourceCode}
      onChange={(value) => setSourceCode(value ?? '')}
      onMount={handleMount}
      theme="smartcc-dark"
      options={{
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 16 },
        automaticLayout: true,
        tabSize: 2,
      }}
    />
  );
}
