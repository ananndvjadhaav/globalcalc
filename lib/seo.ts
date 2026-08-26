import type { Metadata } from "next"

/**
 * Central SEO configuration for GlobalCalc.
 *
 * Update `siteUrl` to your production domain. All canonical URLs, Open Graph
 * metadata, and structured data are derived from these helpers so every
 * future calculator page stays consistent.
 */

export const siteConfig = {
  name: "GlobalCalc",
  tagline: "Simple, Accurate Calculators for Everyday Life",
  description:
    "GlobalCalc provides free, simple, and accurate online calculators for math, finance, health, dates, and everyday needs.",
  // Set NEXT_PUBLIC_SITE_URL in your environment for production.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://globalcalc.example.com",
  locale: "en_US",
} as const

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "")
  const suffix = path.startsWith("/") ? path : `/${path}`
  return `${base}${suffix}`
}

interface BuildMetadataArgs {
  title: string
  description: string
  /** Path relative to the site root, e.g. "/calculators/bmi-calculator". */
  path?: string
  keywords?: string[]
}

/**
 * Build page-level metadata with canonical URL and Open Graph tags.
 * The root layout provides the title template, so pass the bare page title.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  keywords,
}: BuildMetadataArgs): Metadata {
  const canonical = absoluteUrl(path)
  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url: canonical,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

/** JSON-LD for the whole site, rendered once on the homepage. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/calculators")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

/** JSON-LD describing a single calculator as a WebApplication. */
export function calculatorJsonLd(args: {
  name: string
  description: string
  path: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.path),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }
}

/** JSON-LD for a FAQ list, enabling rich results for calculator FAQs. */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

/** JSON-LD breadcrumb trail. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
