import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { CalculatorCard } from "@/components/calculator-card"
import { JsonLd } from "@/components/json-ld"
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo"
import {
  categories,
  getCategory,
  getCalculatorsByCategory,
  type CategorySlug,
} from "@/lib/calculators"

interface Params {
  slug: string
}

export function generateStaticParams(): Params[] {
  return categories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug as CategorySlug)
  if (!category) {
    return buildMetadata({
      title: "Category Not Found",
      description: "The category you are looking for could not be found.",
      path: `/categories/${slug}`,
    })
  }
  return buildMetadata({
    title: `${category.name} Calculators`,
    description: category.description,
    path: `/categories/${category.slug}`,
  })
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const category = getCategory(slug as CategorySlug)
  if (!category) notFound()

  const items = getCalculatorsByCategory(category.slug)
  const path = `/categories/${category.slug}`

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: category.name, path },
        ])}
      />
      <PageHeader
        title={`${category.name} Calculators`}
        description={category.description}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Categories", href: "/categories" },
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
