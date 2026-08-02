import type { Node, Edge } from '@xyflow/react';
import type { ASTNode } from '@/types/compiler';

const NODE_WIDTH = 160;
const NODE_HEIGHT = 56;
const H_SPACING = 24;
const V_SPACING = 90;

/** Counts leaf nodes in a subtree -- used to allocate horizontal width. */
function countLeaves(node: ASTNode): number {
  if (node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + countLeaves(child), 0);
}

/**
 * Simple recursive tree layout (no external layout library needed for a
 * tree this shallow). Each node's x position is the horizontal center of
 * its subtree; y position is depth * V_SPACING.
 *
 * Returns React Flow-ready nodes/edges. Source of truth for the shape
 * being laid out: SystemDesign.md Section 3 `ASTNode`.
 */
export function layoutAST(root: ASTNode): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function place(node: ASTNode, depth: number, xOffset: number): number {
    const leaves = countLeaves(node);
    const subtreeWidth = leaves * (NODE_WIDTH + H_SPACING);

    let cursor = xOffset;
    const childCenters: number[] = [];
    for (const child of node.children) {
      const childLeaves = countLeaves(child);
      const childWidth = childLeaves * (NODE_WIDTH + H_SPACING);
      const childCenter = place(child, depth + 1, cursor);
      childCenters.push(childCenter);
      cursor += childWidth;
    }

    const x =
      node.children.length === 0
        ? xOffset + subtreeWidth / 2 - NODE_WIDTH / 2
        : (childCenters[0] + childCenters[childCenters.length - 1]) / 2;

    nodes.push({
      id: node.id,
      position: { x, y: depth * V_SPACING },
      data: { node },
      type: 'astNode',
      draggable: false,
    });

    for (const child of node.children) {
      edges.push({
        id: `${node.id}-${child.id}`,
        source: node.id,
        target: child.id,
        style: { stroke: 'var(--color-border-strong)' },
      });
    }

    return x + NODE_WIDTH / 2;
  }

  place(root, 0, 0);
  return { nodes, edges };
}

export const AST_NODE_DIMENSIONS = { width: NODE_WIDTH, height: NODE_HEIGHT };
