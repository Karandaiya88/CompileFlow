import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Drag-to-resize hook for a horizontal split (e.g. editor vs. output panel).
 * PRD.md Section 8 requires a "Resizable Sidebar" in the Compiler Workspace.
 *
 * Move/up listeners are attached to `window`, not the container element --
 * a fast drag frequently releases the mouse outside the container's
 * bounding box, and element-scoped mouseup never fires in that case,
 * leaving the drag "stuck" (cursor pinned to col-resize, text-selection
 * disabled) until an unrelated click resets it.
 */
export function useResizableWidth(initial: number, min: number, max: number) {
  const [width, setWidth] = useState(initial);
  const dragging = useRef(false);
  const containerRight = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLElement>) => {
    dragging.current = true;
    containerRight.current = e.currentTarget.parentElement?.getBoundingClientRect().right ?? 0;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      const newWidth = containerRight.current - e.clientX;
      setWidth(Math.min(max, Math.max(min, newWidth)));
    }

    function handleMouseUp() {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [min, max]);

  return { width, onMouseDown };
}
