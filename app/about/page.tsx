import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Learn about GlobalCalc, our mission to make everyday calculations simple, accurate, and free for everyone.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        title="About GlobalCalc"
        description="Simple, accurate calculators for everyday life."
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "About" }]}
      />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            GlobalCalc was created with a single goal: to make everyday
            calculations effortless. Whether you need to work out a percentage,
            estimate a loan payment, check your BMI, or figure out how many days
            are left until an important date, we want the answer to be one
            search away.
          </p>
          <p>
            We believe good tools should be fast, clear, and free. Every
            calculator on GlobalCalc is designed to load quickly, work on any
            device, and give you a trustworthy result without asking you to sign
            up or wade through clutter.
          </p>
          <p>
            We&apos;re continually adding new calculators across math, finance,
            health, dates, unit conversion, and everyday needs. If there&apos;s
            a calculator you&apos;d like to see, we&apos;d love to hear from you.
          </p>
        </div>
      </section>
    </main>
  )
}
