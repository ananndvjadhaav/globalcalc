"use client"

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import type { CurrencyCode } from "@/lib/currency"

/**
 * Small, shared presentational helpers for the interactive calculators.
 * These only style inputs/results with the existing GlobalCalc design tokens
 * — they do not introduce a new calculator architecture. All calculators
 * render their fields/results into the existing <CalculatorInterface> shell.
 */

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
      {...props}
    />
  )
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-md border border-input bg-background px-3 text-base text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  ariaLabel: string
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            data-testid={`segment-${o.value}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-sm leading-relaxed text-destructive"
      role="alert"
      data-testid="calc-error"
    >
      {children}
    </p>
  )
}

export function EmptyResult({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-sm leading-relaxed text-pretty text-muted-foreground"
      data-testid="calc-empty"
    >
      {children}
    </p>
  )
}

export function ResultCallout({
  label,
  value,
  sublabel,
}: {
  label: string
  value: ReactNode
  sublabel?: ReactNode
}) {
  return (
    <div data-testid="calc-result">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {sublabel && (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {sublabel}
        </p>
      )}
    </div>
  )
}

export function ResultList({ children }: { children: ReactNode }) {
  return <dl className="mt-5 border-t border-border pt-1">{children}</dl>
}

export function ResultStat({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border py-2.5 text-sm first:border-t-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}

/* ── Parsing / formatting helpers ─────────────────────────────────────────── */

/** Parse a text field into a finite number, or null when empty/invalid. */
export function parseNum(v: string): number | null {
  if (v.trim() === "") return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/** Format a number with up to `digits` decimals and thousands separators. */
export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—"
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

/**
 * Format a monetary value using the given ISO currency code (defaults to
 * USD, preserving prior behavior for any caller that doesn't pass one).
 * Uses the native Intl.NumberFormat currency formatter so the symbol,
 * decimal count, and grouping follow real currency/locale conventions
 * instead of a hard-coded "$".
 */
export function money(n: number, currency: CurrencyCode = "USD"): string {
  if (!Number.isFinite(n)) return "—"
  try {
    // `undefined` locale = the runtime's own default, which is always a
    // valid BCP-47 tag (unlike some environments' navigator.language,
    // e.g. "en-US@posix" on some Linux browsers, which Intl rejects).
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(n)
  } catch {
    return `${currency} ${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }
}
