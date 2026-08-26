import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { LegalContent } from "@/components/legal-section"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description:
    "Important information about the accuracy and intended use of GlobalCalc calculators.",
  path: "/disclaimer",
})

export default function DisclaimerPage() {
  return (
    <main>
      <PageHeader
        title="Disclaimer"
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Disclaimer" }]}
      />
      <LegalContent
        blocks={[
          {
            heading: "General Information",
            body: [
              "The calculators and information provided on GlobalCalc are for general informational and educational purposes only. They are not a substitute for professional advice.",
            ],
          },
          {
            heading: "Financial Calculations",
            body: [
              "Financial calculators provide estimates only and should not be considered financial advice. Consult a qualified financial professional before making financial decisions.",
            ],
          },
          {
            heading: "Health Calculations",
            body: [
              "Health-related calculators, such as BMI, provide general estimates and do not account for individual circumstances. Consult a qualified healthcare professional for medical advice.",
            ],
          },
          {
            heading: "Accuracy",
            body: [
              "We work to keep our calculators accurate and up to date, but we make no guarantees. Always double-check important results before relying on them.",
            ],
          },
        ]}
      />
    </main>
  )
}
