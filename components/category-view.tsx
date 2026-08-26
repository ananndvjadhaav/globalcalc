import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { CalculatorCard } from "@/components/calculator-card"
import { JsonLd } from "@/components/json-ld"
import { breadcrumbJsonLd } from "@/lib/seo"
import {
  type Category,
  getCalculatorsByCategory,
  categoryPath,
} from "@/lib/calculators"

/**
 * Renders a category listing page. Used by /calculators/[slug] when the slug
 * resolves to a category rather than a calculator.
 */
export function CategoryView({ category }: { category: Category }) {
  const items = getCalculatorsByCategory(category.slug)
  const path = categoryPath(category.slug)

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: category.name, path },
        ])}
      />
      <PageHeader
        title={`${category.name} Calculators`}
        description={category.description}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Calculators", href: "/calculators" },
          { name: category.name },
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {items.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((calc) => (
              <CalculatorCard key={calc.slug} calculator={calc} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border py-16 text-center">
            <p className="text-base font-medium text-foreground">
              No calculators here yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Calculators for this category are on the way.
            </p>
            <Link
              href="/calculators"
              className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary/80"
            >
              Browse all calculators
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
