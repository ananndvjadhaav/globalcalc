import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { CalculatorBrowser } from "@/components/calculator-browser"
import { JsonLd } from "@/components/json-ld"
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "All Calculators",
  description:
    "Browse the full collection of free GlobalCalc calculators for math, finance, health, dates, and everyday use.",
  path: "/calculators",
})

export default async function CalculatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
        ])}
      />
      <PageHeader
        title="All Calculators"
        description="Every GlobalCalc tool in one place. Search or filter by category to find what you need."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Calculators" },
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <CalculatorBrowser initialQuery={q ?? ""} />
      </section>
    </main>
  )
}
