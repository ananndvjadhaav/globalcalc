"use client"

import { useMemo, useState } from "react"
import { Search, SearchX } from "lucide-react"
import { CalculatorCard } from "@/components/calculator-card"
import {
  calculators,
  categories,
  type CategorySlug,
} from "@/lib/calculators"
import { cn } from "@/lib/utils"

type Filter = CategorySlug | "all"

export function CalculatorBrowser({
  initialQuery = "",
}: {
  initialQuery?: string
}) {
  const [query, setQuery] = useState(initialQuery)
  const [filter, setFilter] = useState<Filter>("all")

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return calculators.filter((calc) => {
      const matchesCategory = filter === "all" || calc.category === filter
      if (!matchesCategory) return false
      if (!q) return true
      return (
        calc.name.toLowerCase().includes(q) ||
        calc.summary.toLowerCase().includes(q) ||
        calc.description.toLowerCase().includes(q)
      )
    })
  }, [query, filter])

  return (
    <div>
      <div className="relative max-w-xl">
        <label htmlFor="browse-search" className="sr-only">
          Search calculators
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="browse-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calculators"
          className="h-12 w-full rounded-md border border-input bg-background py-3 pl-12 pr-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      <div
        className="mt-6 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by category"
      >
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All"
        />
        {categories.map((category) => (
          <FilterChip
            key={category.slug}
            active={filter === category.slug}
            onClick={() => setFilter(category.slug)}
            label={category.name}
          />
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {results.length} {results.length === 1 ? "calculator" : "calculators"}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((calc) => (
            <CalculatorCard key={calc.slug} calculator={calc} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center rounded-lg border border-dashed border-border py-16 text-center">
          <SearchX
            className="h-8 w-8 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-3 text-base font-medium text-foreground">
            No calculators found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search term or category.
          </p>
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  )
}
