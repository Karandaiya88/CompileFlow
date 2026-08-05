import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useSettingsStore } from '@/features/settings/store/settingsStore'

export function SettingsPage() {
  const editorFontSize = useSettingsStore((s) => s.editorFontSize)
  const setEditorFontSize = useSettingsStore((s) => s.setEditorFontSize)
  const compileDelayMs = useSettingsStore((s) => s.compileDelayMs)
  const setCompileDelayMs = useSettingsStore((s) => s.setCompileDelayMs)

  return (
    <>
      <PageHeader title="Settings" description="Configure your SmartCC preferences." />

      <div className="flex max-w-xl flex-col gap-4">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Theme</h3>
            <Badge tone="info">Dark (default)</Badge>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            SmartCC ships dark-first, per Design.md. A light theme isn't planned for v1 -- it
            isn't in current scope, so this control isn't shown as a toggle that does nothing.
          </p>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold">Editor Font Size</h3>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={11}
              max={18}
              step={1}
              value={editorFontSize}
              onChange={(e) => setEditorFontSize(Number(e.target.value))}
              className="flex-1 accent-[var(--color-accent-primary)]"
            />
            <span className="w-10 font-mono text-sm text-[var(--color-text-secondary)]">
              {editorFontSize}px
            </span>
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            Applies immediately to the Monaco editor in the Compiler Workspace.
          </p>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold">Simulated Compile Delay</h3>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={2000}
              step={100}
              value={compileDelayMs}
              onChange={(e) => setCompileDelayMs(Number(e.target.value))}
              className="flex-1 accent-[var(--color-accent-primary)]"
            />
            <span className="w-14 font-mono text-sm text-[var(--color-text-secondary)]">
              {compileDelayMs}ms
            </span>
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            Controls how long the mock adapter takes to "compile" -- useful for demoing the
            loading state. Has no effect once a real backend exists (v2+); this control will
            be removed at that point rather than left as dead UI.
          </p>
        </Card>
      </div>
    </>
  )
}
