import Link from "next/link"
import { HeroSearch } from "@/components/hero-search"
import { getPopularCalculators } from "@/lib/calculators"

export function Hero() {
  const popular = getPopularCalculators().slice(0, 6)

  return (
    <section className="border-b border-border bg-secondary/30">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          GlobalCalc
        </p>
        <h1 className="mt-4 text-pretty text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Free Online Calculators
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          GlobalCalc gives you simple and accurate calculators for everyday
          needs, from math and finance to health, dates, and unit conversion.
          No sign-up required.
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <HeroSearch />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Popular:</span>
          {popular.map((calc) => (
            <Link
              key={calc.slug}
              href={`/calculators/${calc.slug}`}
              className="rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {calc.name.replace(" Calculator", "")}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
