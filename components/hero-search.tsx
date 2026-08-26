"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/calculators?q=${encodeURIComponent(q)}` : "/calculators")
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 sm:flex-row"
    >
      <div className="relative flex-1">
        <label htmlFor="hero-search" className="sr-only">
          Search for a calculator
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="hero-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calculators, e.g. BMI, loan, percentage"
          className="h-12 w-full rounded-md border border-input bg-background py-3 pl-12 pr-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        Search
      </button>
    </form>
  )
}
