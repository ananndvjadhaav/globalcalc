import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Reusable shell for a calculator's interactive area: an inputs panel on the
 * left and a results panel on the right. Interactive calculators render their
 * fields into `inputs` and their output into `result`.
 *
 * When no interactive component exists yet, `PlaceholderInterface` fills the
 * same shell so every calculator page has a consistent, finished layout.
 */
export function CalculatorInterface({
  inputs,
  result,
  className,
}: {
  inputs: ReactNode
  result: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid gap-4 lg:grid-cols-5 lg:gap-6",
        className,
      )}
    >
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6 lg:col-span-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Inputs
        </h2>
        <div className="mt-4">{inputs}</div>
      </div>
      <div className="rounded-lg border border-border bg-secondary/40 p-5 sm:p-6 lg:col-span-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Result
        </h2>
        <div className="mt-4">{result}</div>
      </div>
    </div>
  )
}

/**
 * Default placeholder rendered when a calculator's interactive component has
 * not been built yet. Keeps the page complete and communicates status.
 */
export function PlaceholderInterface({ name }: { name: string }) {
  return (
    <CalculatorInterface
      inputs={
        <div className="space-y-4" aria-hidden="true">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-10 w-full rounded-md border border-dashed border-border bg-background" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-10 w-full rounded-md border border-dashed border-border bg-background" />
          </div>
          <div className="h-10 w-32 rounded-md bg-muted" />
        </div>
      }
      result={
        <div className="flex h-full flex-col justify-center">
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            The interactive {name} is coming soon. Its inputs and live results
            will appear right here — the page, formula, and examples below are
            already in place.
          </p>
        </div>
      }
    />
  )
}
