import Link from "next/link"
import { ChevronRight } from "lucide-react"

export interface Crumb {
  name: string
  href?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.name} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className="text-foreground"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
