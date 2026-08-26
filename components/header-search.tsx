"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

interface HeaderSearchProps {
  onSubmitNavigate?: () => void
}

export function HeaderSearch({ onSubmitNavigate }: HeaderSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    onSubmitNavigate?.()
    router.push(q ? `/calculators?q=${encodeURIComponent(q)}` : "/calculators")
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative">
      <label htmlFor="header-search" className="sr-only">
        Search calculators
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id="header-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search calculators"
        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
      />
    </form>
  )
}
