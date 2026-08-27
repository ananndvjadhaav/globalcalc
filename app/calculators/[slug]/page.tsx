import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, FolderTree, LayoutGrid } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { CalculatorCard } from "@/components/calculator-card"
import { CategoryView } from "@/components/category-view"
import { JsonLd } from "@/components/json-ld"
import { CalculatorInterface, PlaceholderInterface } from "@/components/calculator/calculator-interface"
import {
  Explanation,
  FormulaBlock,
  ExampleBlock,
  Limitations,
  FaqList,
} from "@/components/calculator/sections"
import { getCalculatorComponent } from "@/components/calculator/registry"
import {
  calculators,
  categories,
  getCalculator,
  getCategory,
  getCalculatorsByCategory,
  isCategorySlug,
  categoryPath,
  calculatorPath,
} from "@/lib/calculators"
import {
  buildMetadata,
  calculatorJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo"

interface Params {
  slug: string
}

/**
 * A single dynamic route powers both individual calculators and category
 * listings. Categories resolve first (e.g. /calculators/math), then
 * calculators (e.g. /calculators/percentage-calculator). Slugs never collide
 * because category slugs and calculator slugs are drawn from the same
 * registry.
 */
export function generateStaticParams(): Params[] {
  return [
    ...categories.map((category) => ({ slug: category.slug })),
    ...calculators.map((calc) => ({ slug: calc.slug })),
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params

  if (isCategorySlug(slug)) {
    const category = getCategory(slug)!
    return buildMetadata({
      title: `${category.name} Calculators`,
      description: category.description,
      path: categoryPath(category.slug),
    })
  }

  const calc = getCalculator(slug)
  if (!calc) {
    return buildMetadata({
      title: "Calculator Not Found",
      description: "The calculator you are looking for could not be found.",
      path: calculatorPath(slug),
    })
  }
  return buildMetadata({
    title: calc.seoTitle ?? calc.name,
    description: calc.seoDescription ?? calc.description,
    path: calculatorPath(calc.slug),
    keywords: [calc.name, ...calc.keywords, "free online calculator"],
  })
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params

  // Category listing at /calculators/[category].
  if (isCategorySlug(slug)) {
    return <CategoryView category={getCategory(slug)!} />
  }

  const calc = getCalculator(slug)
  if (!calc) notFound()

  const category = getCategory(calc.category)
  const related = getCalculatorsByCategory(calc.category)
    .filter((c) => c.slug !== calc.slug)
    .slice(0, 3)
  const path = calculatorPath(calc.slug)
  const content = calc.content
  const InteractiveCalculator = getCalculatorComponent(calc.slug)

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/calculators" },
    ...(category ? [{ name: category.name, path: categoryPath(category.slug) }] : []),
    { name: calc.name, path },
  ]

  return (
    <main>
      <JsonLd
        data={calculatorJsonLd({
          name: calc.name,
          description: calc.description,
          path,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(breadcrumbTrail)} />
      {content?.faqs && content.faqs.length > 0 && (
        <JsonLd data={faqJsonLd(content.faqs)} />
      )}

      <PageHeader
        title={calc.name}
        description={calc.description}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Calculators", href: "/calculators" },
          ...(category
            ? [{ name: category.name, href: categoryPath(category.slug) }]
            : []),
          { name: calc.name },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Interface — interactive component if registered, else placeholder. */}
        {content?.intro && (
          <p className="mb-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            {content.intro}
          </p>
        )}
        {InteractiveCalculator ? (
          <InteractiveCalculator />
        ) : (
          <PlaceholderInterface name={calc.name} />
        )}

        {/* Content sections render only when their data exists. */}
        <Explanation paragraphs={content?.howItWorks} />
        <FormulaBlock formula={content?.formula} />
        <ExampleBlock example={content?.example} />
        <Limitations notes={content?.limitations} />
        <FaqList faqs={content?.faqs} />

        {/* Internal linking: parent category + full directory. */}
        <section className="mt-12 flex flex-wrap gap-3">
          {category && (
            <Link
              href={categoryPath(category.slug)}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40"
            >
              <FolderTree className="h-4 w-4 text-primary" aria-hidden="true" />
              More {category.name} calculators
            </Link>
          )}
          <Link
            href="/calculators"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-accent/40"
          >
            <LayoutGrid className="h-4 w-4 text-primary" aria-hidden="true" />
            All calculators
          </Link>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Related calculators
              </h2>
              {category && (
                <Link
                  href={categoryPath(category.slug)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View all
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CalculatorCard key={c.slug} calculator={c} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
