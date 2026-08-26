import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs"

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Crumb[]
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <h1 className="text-pretty text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
