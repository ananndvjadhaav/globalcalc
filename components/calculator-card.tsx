import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { CalculatorMeta } from "@/lib/calculators"
import { getCategory } from "@/lib/calculators"

export function CalculatorCard({ calculator }: { calculator: CalculatorMeta }) {
  const Icon = calculator.icon
  const category = getCategory(calculator.category)

  return (
    <Link
      href={`/calculators/${calculator.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {calculator.status === "coming-soon" && (
          <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">
        {calculator.name}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {calculator.summary}
      </p>
      <div className="mt-4 flex items-center justify-between pt-1">
        {category && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {category.name}
          </span>
        )}
        <ArrowRight
          className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}
