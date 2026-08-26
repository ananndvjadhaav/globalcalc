/**
 * Renders a JSON-LD structured-data script tag.
 * Usage: <JsonLd data={websiteJsonLd()} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inject here; it contains only our own data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
