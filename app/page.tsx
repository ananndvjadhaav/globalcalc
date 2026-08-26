import { Hero } from "@/components/sections/hero"
import { PopularCalculators } from "@/components/sections/popular-calculators"
import { CategoryGrid } from "@/components/sections/category-grid"
import { WhyGlobalCalc } from "@/components/sections/why-globalcalc"
import { JsonLd } from "@/components/json-ld"
import { websiteJsonLd } from "@/lib/seo"

export default function HomePage() {
  return (
    <main>
      <JsonLd data={websiteJsonLd()} />
      <Hero />
      <PopularCalculators />
      <CategoryGrid />
      <WhyGlobalCalc />
    </main>
  )
}
