import Link from "next/link"
import { SectionHeading } from "@/components/section-heading"
import { categories, countByCategory } from "@/lib/calculators"

export function CategoryGrid() {
  return (
    <section
      className="border-y border-border bg-secondary/30"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div id="categories-heading">
          <SectionHeading
            title="Calculator Categories"
            description="Browse by topic to find the right calculator for the job."
          />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  <h3 className="text-base font-semibold text-foreground">
                    {category.name}
                  </h3>
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
      </div>
    </section>
  )
}
