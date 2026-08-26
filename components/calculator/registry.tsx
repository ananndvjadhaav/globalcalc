import type { ComponentType } from "react"
import { PercentageCalculator } from "./impl/percentage-calculator"
import { AgeCalculator } from "./impl/age-calculator"
import { BmiCalculator } from "./impl/bmi-calculator"
import { DiscountCalculator } from "./impl/discount-calculator"
import { LoanCalculator } from "./impl/loan-calculator"
import { DateCalculator } from "./impl/date-calculator"

/**
 * Registry of interactive calculator components, keyed by calculator slug.
 *
 * This is the single place where a calculator's UI/logic is wired up. It is
 * intentionally separate from the data registry in `lib/calculators.ts` so
 * that metadata stays a plain, importable data module while the interactive
 * pieces (which may be client components) live here.
 *
 * ── Adding a calculator's interface ──────────────────────────────────────
 * 1. Build the interactive component, e.g.
 *    `components/calculator/impl/percentage-calculator.tsx`.
 * 2. Import it below and add it to `calculatorComponents` under its slug.
 * 3. Flip that calculator's `status` to "available" in `lib/calculators.ts`.
 *
 * Until a slug appears here, the page renders the shared placeholder
 * interface automatically — no page code changes required.
 */

export type CalculatorComponent = ComponentType

export const calculatorComponents: Record<string, CalculatorComponent> = {
  "percentage-calculator": PercentageCalculator,
  "age-calculator": AgeCalculator,
  "bmi-calculator": BmiCalculator,
  "discount-calculator": DiscountCalculator,
  "loan-calculator": LoanCalculator,
  "date-calculator": DateCalculator,
}

export function getCalculatorComponent(
  slug: string,
): CalculatorComponent | undefined {
  return calculatorComponents[slug]
}
