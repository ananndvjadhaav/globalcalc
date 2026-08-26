import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/seo"
import { calculators, categories } from "@/lib/calculators"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes = [
    "/",
    "/calculators",
    "/categories",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.7,
  }))

  const categoryRoutes = categories.map((category) => ({
    url: absoluteUrl(`/categories/${category.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const calculatorRoutes = calculators.map((calc) => ({
    url: absoluteUrl(`/calculators/${calc.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes, ...calculatorRoutes]
}
