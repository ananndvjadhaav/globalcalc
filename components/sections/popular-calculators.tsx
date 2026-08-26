import { SectionHeading } from "@/components/section-heading"
import { CalculatorCard } from "@/components/calculator-card"
import { getPopularCalculators } from "@/lib/calculators"

export function PopularCalculators() {
  const popular = getPopularCalculators()

  return (
    <section
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
      aria-labelledby="popular-heading"
    >
      <div id="popular-heading">
        <SectionHeading
          title="Popular Calculators"
          description="The tools people reach for most, ready when you need a quick, reliable answer."
          action={{ href: "/calculators", label: "View all" }}
        />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {popular.map((calc) => (
          <CalculatorCard key={calc.slug} calculator={calc} />
        ))}
      </div>
    </section>
  )
}
