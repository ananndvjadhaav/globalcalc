import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { JsonLd } from "@/components/json-ld"
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo"
import { categories, countByCategory } from "@/lib/calculators"

export const metadata: Metadata = buildMetadata({
  title: "Categories",
  description:
    "Browse GlobalCalc calculators by category: math, finance, health, date & time, unit conversion, and everyday tools.",
  path: "/categories",
})

export default function CategoriesPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
        ])}
      />
      <PageHeader
        title="Categories"
        description="Pick a category to see every calculator it contains."
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Categories" }]}
      />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon
            const count = countByCategory(category.slug)
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {category.name}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {count} {count === 1 ? "calculator" : "calculators"}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
