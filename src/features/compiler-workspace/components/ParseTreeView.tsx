import { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, type NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { layoutAST } from '../lib/treeLayout';
import { ASTNodeCard } from './ASTNodeCard';
import { useWorkspaceStore } from '../store/workspaceStore';

const nodeTypes: NodeTypes = { astNode: ASTNodeCard };

/**
 * Parse Tree visualization -- PRD.md Section 8, SystemDesign.md Section 4.2
 * ("interactive, zoomable" per Section 8). Renders the AST returned by the
 * mock/real compilerService via React Flow, using the tree layout in
 * lib/treeLayout.ts.
 */
export function ParseTreeView() {
  const status = useWorkspaceStore((s) => s.status);
  const result = useWorkspaceStore((s) => s.result);

  const { nodes, edges } = useMemo(() => {
    if (!result?.ast) return { nodes: [], edges: [] };
    return layoutAST(result.ast);
  }, [result]);

  if (status === 'idle' || status === 'compiling') {
    return (
      <p className="p-3 text-sm text-[var(--color-text-secondary)]">
        The parse tree will appear here after you compile.
      </p>
    );
  }

  if (!result?.ast) {
    return (
      <p className="p-3 text-sm text-[var(--color-text-secondary)]">
        No parse tree available -- compilation failed before syntax analysis completed.
      </p>
    );
  }

  return (
    <div className="h-full min-h-[320px] w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        nodesDraggable={false}
        elementsSelectable={false}
      >
        <Background color="var(--color-border-subtle)" gap={20} />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          maskColor="rgba(10,10,11,0.7)"
          nodeColor="var(--color-phase-syntax)"
        />
      </ReactFlow>
    </div>
  );
}
