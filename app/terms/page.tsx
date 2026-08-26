import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { LegalContent } from "@/components/legal-section"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "The terms and conditions for using GlobalCalc's free online calculators.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <main>
      <PageHeader
        title="Terms of Use"
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Terms of Use" }]}
      />
      <LegalContent
        blocks={[
          {
            heading: "Acceptance of Terms",
            body: [
              "By accessing and using GlobalCalc, you agree to these Terms of Use. If you do not agree, please do not use the site.",
            ],
          },
          {
            heading: "Use of the Service",
            body: [
              "GlobalCalc provides free online calculators for personal and informational use. You may use the calculators for lawful purposes only.",
            ],
          },
          {
            heading: "No Warranty",
            body: [
              "The calculators and content are provided \"as is\" without warranties of any kind. While we strive for accuracy, we do not guarantee that results are error-free or suitable for every situation.",
            ],
          },
          {
            heading: "Limitation of Liability",
            body: [
              "GlobalCalc is not liable for any decisions made or actions taken based on results from our calculators. Always verify important calculations independently.",
            ],
          },
        ]}
      />
    </main>
  )
}
