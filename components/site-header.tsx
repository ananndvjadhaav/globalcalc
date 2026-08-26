"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { HeaderSearch } from "@/components/header-search"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/calculators", label: "Calculators" },
  { href: "/categories", label: "Categories" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="GlobalCalc home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Global<span className="text-primary">Calc</span>
          </span>
        </Link>

        <nav
          className="ml-2 hidden items-center gap-1 md:flex"
          aria-label="Primary"
        >
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto hidden w-full max-w-xs md:block">
          <HeaderSearch />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background md:hidden"
        >
          <div className="mx-auto max-w-6xl space-y-4 px-4 py-4 sm:px-6">
            <HeaderSearch onSubmitNavigate={() => setOpen(false)} />
            <nav className="flex flex-col" aria-label="Mobile">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-base font-medium",
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
