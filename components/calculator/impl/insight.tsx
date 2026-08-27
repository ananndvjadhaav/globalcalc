"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * A small, non-intrusive callout for a calculator-specific derived insight.
 * Renders inline inside the existing result area — never a popup, modal,
 * or toast. Uses the tw-animate-css utilities already used across the site
 * for a subtle entrance animation (no third-party dependency).
 */
export function SmartInsight({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="note"
      aria-live="polite"
      data-testid="smart-insight"
      className={cn(
        "mt-5 animate-in fade-in slide-in-from-bottom-1 rounded-lg border border-primary/25 bg-primary/5 p-4 text-sm leading-relaxed text-foreground duration-500",
        className,
      )}
    >
      {children}
    </div>
  )
}
