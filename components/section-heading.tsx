import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface SectionHeadingProps {
  title: string
  description?: string
  action?: { href: string; label: string }
}

export function SectionHeading({
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-pretty text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {action.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
