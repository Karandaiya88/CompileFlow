import { useCallback, useRef, useState } from 'react';

/**
 * Drag-to-resize hook for a horizontal split (e.g. editor vs. output panel).
 * PRD.md Section 8 requires a "Resizable Sidebar" in the Compiler Workspace.
 */
export function useResizableWidth(initial: number, min: number, max: number) {
  const [width, setWidth] = useState(initial);
  const dragging = useRef(false);

  const onMouseDown = useCallback(() => {
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!dragging.current) return;
      const container = e.currentTarget.getBoundingClientRect();
      const newWidth = container.right - e.clientX;
      setWidth(Math.min(max, Math.max(min, newWidth)));
    },
    [min, max],
  );

  return { width, onMouseDown, onMouseUp, onMouseMove };
}
