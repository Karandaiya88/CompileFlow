import { BookOpen, Code } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Accordion } from '@/components/ui/Accordion'

export function HelpPage() {
  return (
    <>
      <PageHeader title="Help" description="Documentation and guidance for using SmartCC." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card padding="none" className="overflow-hidden">
            <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
              <h3 className="text-sm font-semibold">Frequently Asked Questions</h3>
            </div>
            <Accordion>
              <Accordion.Item question="What language does SmartCC compile?">
                A C-like subset language, covering functions, variable declarations, arithmetic
                expressions, and return statements. See the Grammar Library for the full set of
                supported productions.
              </Accordion.Item>
              <Accordion.Item question="Is there a real compiler running behind this?">
                Not yet. SmartCC v1 runs entirely on realistic, manually-traced mock data so the
                full pipeline experience can be built and reviewed before the real FastAPI +
                PLY backend is implemented in v2.
              </Accordion.Item>
              <Accordion.Item question="Why does compiling always take about half a second?">
                That's a simulated delay so the loading state is visible and demo-able. You can
                adjust it (or set it to 0ms) under Settings → Simulated Compile Delay.
              </Accordion.Item>
              <Accordion.Item question="What does the red phase in the Pipeline stepper mean?">
                It marks exactly which compiler phase rejected your program. Every phase before
                it succeeded; every phase after it never ran. Check the Diagnostics or Semantic
                Report tab for the specific message.
              </Accordion.Item>
              <Accordion.Item question="Will my projects be saved if I refresh the page?">
                Not in v1 -- projects, history, and settings are all in-memory only, since there's
                no backend or database yet. Persistence arrives once the real backend (v2+) and
                database (v3+) are built.
              </Accordion.Item>
            </Accordion>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="mb-2 flex items-center gap-2">
              <BookOpen size={16} className="text-[var(--color-accent-primary)]" />
              <h3 className="text-sm font-semibold">Project Documentation</h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              PRD.md, Architecture.md, SystemDesign.md, and the rest of the engineering docs
              live at the repository root.
            </p>
          </Card>
          <Card>
            <div className="mb-2 flex items-center gap-2">
              <Code size={16} className="text-[var(--color-accent-primary)]" />
              <h3 className="text-sm font-semibold">Source Code</h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Built by Karan Daiya as a portfolio-grade educational compiler platform.
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
