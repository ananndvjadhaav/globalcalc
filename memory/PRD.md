# GlobalCalc — Product/Requirements Memory

## Project
GlobalCalc — a Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 SEO-focused
calculator directory. Package manager: **pnpm** (workspace config requires pnpm ≥10.9 / Node 22;
in this pod Node is v20, so builds were verified via `npm install` + `next build`, and the
npm-created `package-lock.json` was removed afterward to keep the repo pnpm-only).

Single source of truth for architecture:
- `lib/calculators.ts` — metadata registry (categories, calculators, content, SEO, helpers)
- `components/calculator/registry.tsx` — maps calculator slug → interactive component
- `components/calculator/calculator-interface.tsx` — shared inputs/result shell + placeholder
- `app/calculators/[slug]/page.tsx` — dynamic page (also renders category listings)

## Task completed (2026-06)
Implemented the six interactive calculator components that were previously `coming-soon`.
Platform (homepage, directory, category pages, SEO, JSON-LD, sitemap, robots, breadcrumbs,
search, internal linking, design system) was NOT rebuilt — only the registry wiring and the
six `status` flags were touched.

### Files created
- `components/calculator/impl/fields.tsx` — shared field/result primitives + parse/format helpers
- `components/calculator/impl/percentage-calculator.tsx`
- `components/calculator/impl/age-calculator.tsx`
- `components/calculator/impl/bmi-calculator.tsx`
- `components/calculator/impl/discount-calculator.tsx`
- `components/calculator/impl/loan-calculator.tsx`
- `components/calculator/impl/date-calculator.tsx`

### Files modified
- `components/calculator/registry.tsx` — registered all six components by slug
- `lib/calculators.ts` — flipped all six `status: "coming-soon"` → `"available"`

### Verification
- `npx tsc --noEmit` → 0 errors
- `npx next build` → success; all 31 pages prerender, all 12 `/calculators/[slug]` paths compile
- Runtime curl of all six routes → no placeholder text, interactive inputs present

## Backlog / not in scope this task
- No additional calculators, no redesign, no unrelated changes (per instructions).
