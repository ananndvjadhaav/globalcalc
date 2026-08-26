import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import type {
  CalculatorFormula,
  Faq,
  WorkedExample,
} from "@/lib/calculators"

/**
 * Reusable, content-driven sections for individual calculator pages.
 * Each renders nothing when its data is absent, so pages stay clean whether
 * or not a calculator has supplied the corresponding content.
 */

export function ContentSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export function Explanation({ paragraphs }: { paragraphs?: string[] }) {
  if (!paragraphs || paragraphs.length === 0) return null
  return (
    <ContentSection title="How it works">
      <div className="space-y-3">
        {paragraphs.map((text, i) => (
          <p
            key={i}
            className="text-pretty text-base leading-relaxed text-muted-foreground"
          >
            {text}
          </p>
        ))}
      </div>
    </ContentSection>
  )
}

export function FormulaBlock({ formula }: { formula?: CalculatorFormula }) {
  if (!formula) return null
  return (
    <ContentSection title="Formula">
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
        <code className="block text-pretty font-mono text-base text-foreground">
          {formula.expression}
        </code>
        {formula.where && formula.where.length > 0 && (
          <dl className="mt-5 space-y-2 border-t border-border pt-4">
            {formula.where.map((term) => (
              <div key={term.symbol} className="flex gap-3 text-sm">
                <dt className="min-w-16 shrink-0 font-mono font-medium text-primary">
                  {term.symbol}
                </dt>
                <dd className="text-muted-foreground">{term.meaning}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </ContentSection>
  )
}

export function ExampleBlock({ example }: { example?: WorkedExample }) {
  if (!example) return null
  return (
    <ContentSection title="Worked example">
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
        <p className="font-medium text-foreground">{example.scenario}</p>
        <ol className="mt-4 space-y-2">
          {example.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-medium text-primary">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 border-t border-border pt-4 text-sm font-medium text-foreground">
          {example.result}
        </p>
      </div>
    </ContentSection>
  )
}

export function FaqList({ faqs }: { faqs?: Faq[] }) {
  if (!faqs || faqs.length === 0) return null
  return (
    <ContentSection title="Frequently asked questions">
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {faqs.map((faq) => (
          <details key={faq.question} className="group px-5 py-4 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </ContentSection>
  )
}
