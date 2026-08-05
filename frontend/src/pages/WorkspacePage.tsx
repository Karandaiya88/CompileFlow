import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { CodeEditor } from '@/features/compiler-workspace/components/CodeEditor';
import { CompileButton } from '@/features/compiler-workspace/components/CompileButton';
import { PipelineStepper } from '@/features/compiler-workspace/components/PipelineStepper';
import { ConsolePanel } from '@/features/compiler-workspace/components/ConsolePanel';
import { ErrorPanel } from '@/features/compiler-workspace/components/ErrorPanel';
import { TokenViewer } from '@/features/compiler-workspace/components/TokenViewer';
import { SymbolTableView } from '@/features/compiler-workspace/components/SymbolTableView';
import { ParseTreeView } from '@/features/compiler-workspace/components/ParseTreeView';
import { SemanticReportView } from '@/features/compiler-workspace/components/SemanticReportView';
import { TACViewer } from '@/features/compiler-workspace/components/TACViewer';
import { OptimizationComparisonView } from '@/features/compiler-workspace/components/OptimizationComparisonView';
import { AssemblyViewer } from '@/features/compiler-workspace/components/AssemblyViewer';
import { WorkspaceSidebar } from '@/features/compiler-workspace/components/WorkspaceSidebar';
import { useResizableWidth } from '@/features/compiler-workspace/hooks/useResizableWidth';
import { useWorkspaceStore } from '@/features/compiler-workspace/store/workspaceStore';

const TABS = [
  { key: 'pipeline', label: 'Pipeline' },
  { key: 'tokens', label: 'Tokens' },
  { key: 'symbols', label: 'Symbols' },
  { key: 'parseTree', label: 'Parse Tree' },
  { key: 'semanticReport', label: 'Semantic Report' },
  { key: 'tac', label: 'TAC' },
  { key: 'optimization', label: 'Optimization' },
  { key: 'assembly', label: 'Assembly' },
  { key: 'console', label: 'Console' },
  { key: 'diagnostics', label: 'Diagnostics' },
] as const;

export function WorkspacePage() {
  const activeTab = useWorkspaceStore((s) => s.activeTab);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const result = useWorkspaceStore((s) => s.result);
  const { width, onMouseDown } = useResizableWidth(380, 300, 560);

  return (
    <div className="flex h-[calc(100vh-104px)] flex-col">
      <PageHeader
        title="Compiler Workspace"
        description="Write source code and watch it move through every compiler phase."
      />

      <Card padding="none" className="flex min-h-0 flex-1 overflow-hidden">
        {/* Resizable file sidebar */}
        <div className="w-44 shrink-0 border-r border-[var(--color-border-subtle)]">
          <WorkspaceSidebar />
        </div>

        {/* Editor + output panel, with a drag handle between them */}
        <div className="flex min-w-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-3 py-2">
              <span className="font-mono text-xs text-[var(--color-text-secondary)]">main.sc</span>
              <CompileButton />
            </div>
            <div className="min-h-0 flex-1">
              <CodeEditor />
            </div>
          </div>

          {/* Drag handle */}
          <div
            onMouseDown={onMouseDown}
            className="w-1 shrink-0 cursor-col-resize bg-[var(--color-border-subtle)] hover:bg-[var(--color-accent-primary)]"
          />

          {/* Output panel */}
          <div
            style={{ width }}
            className="flex shrink-0 flex-col border-l border-[var(--color-border-subtle)]"
          >
            <div className="flex overflow-x-auto border-b border-[var(--color-border-subtle)]">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition-colors',
                    activeTab === tab.key
                      ? 'border-[var(--color-accent-primary)] text-[var(--color-text-primary)]'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                  )}
                >
                  {tab.label}
                  {tab.key === 'diagnostics' && result?.diagnostics.length ? (
                    <span className="ml-1.5 rounded-full bg-[var(--color-error)] px-1.5 py-0.5 text-[10px] text-white">
                      {result.diagnostics.length}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            <div
              className={cn(
                'min-h-0 flex-1',
                activeTab === 'parseTree' ? 'overflow-hidden p-2' : 'overflow-y-auto p-3',
              )}
            >
              {activeTab === 'pipeline' && (
                <div className="flex flex-col gap-4">
                  <PipelineStepper />
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Every pipeline output -- Tokens, Symbol Table, Parse Tree, Semantic Report,
                    TAC, Optimization Comparison, and Assembly -- is live. Project management,
                    Grammar Library, History, Reports, Settings, and Help arrive in Sprint 8,
                    per Phases.md.
                  </p>
                </div>
              )}
              {activeTab === 'tokens' && <TokenViewer />}
              {activeTab === 'symbols' && <SymbolTableView />}
              {activeTab === 'parseTree' && <ParseTreeView />}
              {activeTab === 'semanticReport' && <SemanticReportView />}
              {activeTab === 'tac' && <TACViewer />}
              {activeTab === 'optimization' && <OptimizationComparisonView />}
              {activeTab === 'assembly' && <AssemblyViewer />}
              {activeTab === 'console' && <ConsolePanel />}
              {activeTab === 'diagnostics' && <ErrorPanel />}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
