import type { Metadata } from "next"
import { Mail } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with the GlobalCalc team with questions, feedback, or calculator suggestions.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        title="Contact Us"
        description="Questions, feedback, or a calculator you'd like us to build? We'd love to hear from you."
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Contact" }]}
      />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Email us
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Send your questions or suggestions and we&apos;ll get back to
                you as soon as we can.
              </p>
              <a
                href="mailto:hello@globalcalc.example.com"
                className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary/80"
              >
                hello@globalcalc.example.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
