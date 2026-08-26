import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { LegalContent } from "@/components/legal-section"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How GlobalCalc handles your data and respects your privacy while you use our calculators.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <main>
      <PageHeader
        title="Privacy Policy"
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Privacy Policy" }]}
      />
      <LegalContent
        blocks={[
          {
            heading: "Overview",
            body: [
              "This Privacy Policy explains how GlobalCalc handles information when you use our website. We are committed to keeping things simple and respecting your privacy.",
            ],
          },
          {
            heading: "Information We Collect",
            body: [
              "GlobalCalc calculators run in your browser. The values you enter into a calculator are not sent to us or stored on our servers.",
              "We may collect anonymous, aggregated usage analytics to understand which calculators are most helpful and to improve the site.",
            ],
          },
          {
            heading: "Cookies",
            body: [
              "We may use cookies or similar technologies to remember basic preferences and to measure site performance. You can disable cookies in your browser settings at any time.",
            ],
          },
          {
            heading: "Changes to This Policy",
            body: [
              "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.",
            ],
          },
        ]}
      />
    </main>
  )
}
