import type { LucideIcon } from "lucide-react"
import {
  Percent,
  CalendarDays,
  HeartPulse,
  Tag,
  Landmark,
  CalendarClock,
  Calculator,
  Ruler,
  Sigma,
  Wallet,
  Activity,
  Home,
} from "lucide-react"

/**
 * Central data model for GlobalCalc.
 *
 * Everything on the site (homepage, category pages, individual calculator
 * pages, search, sitemap, and structured data) is derived from these
 * registries. This is the single source of truth.
 *
 * ── Adding a new calculator ──────────────────────────────────────────────
 * 1. Add one `CalculatorMeta` entry to the `calculators` array below.
 * 2. (Optional) Fill in `content` so the explanation / formula / example /
 *    FAQ sections render on the page. Omitted sections are simply skipped.
 * 3. When the interactive logic is ready, register the component in
 *    `components/calculator/registry.tsx` and flip `status` to "available".
 *
 * The calculator automatically gets an SEO-friendly page at
 * /calculators/[slug], a card in the directory and its category, sitemap
 * entries, breadcrumbs, and structured data — no page code to duplicate.
 */

export type CategorySlug =
  | "math"
  | "finance"
  | "health"
  | "date-time"
  | "unit-conversion"
  | "everyday"

export interface Category {
  slug: CategorySlug
  name: string
  description: string
  icon: LucideIcon
}

/** A term used inside a formula, e.g. { symbol: "P", meaning: "Principal" }. */
export interface FormulaTerm {
  symbol: string
  meaning: string
}

export interface CalculatorFormula {
  /** The formula itself, shown in a monospace block. */
  expression: string
  /** Optional legend describing each symbol in the expression. */
  where?: FormulaTerm[]
}

export interface WorkedExample {
  scenario: string
  steps: string[]
  result: string
}

export interface Faq {
  question: string
  answer: string
}

/** Long-form, per-calculator content that powers the reusable page sections. */
export interface CalculatorContent {
  /** Short lead paragraph shown above the interface. */
  intro?: string
  /** "How it works" — one string per paragraph. */
  howItWorks?: string[]
  formula?: CalculatorFormula
  example?: WorkedExample
  faqs?: Faq[]
}

export interface CalculatorMeta {
  /** Stable unique id (kept separate from slug so slugs can change safely). */
  id: string
  /** URL segment: /calculators/[slug]. */
  slug: string
  name: string
  /** Short one-line summary used on cards. */
  summary: string
  /** Longer description used for page intros and default meta description. */
  description: string
  category: CategorySlug
  icon: LucideIcon
  /** Extra terms the search should match (synonyms, abbreviations, use cases). */
  keywords: string[]
  /** Highlighted on the homepage / directory "Popular" section. */
  popular?: boolean
  /** Whether the interactive calculator logic has shipped yet. */
  status: "available" | "coming-soon"
  /** Optional SEO overrides — fall back to `name` / `description` if absent. */
  seoTitle?: string
  seoDescription?: string
  /** Reusable page content (explanation, formula, example, FAQ). */
  content?: CalculatorContent
}

export const categories: Category[] = [
  {
    slug: "math",
    name: "Math",
    description: "Percentages, fractions, averages, and everyday number crunching.",
    icon: Sigma,
  },
  {
    slug: "finance",
    name: "Finance",
    description: "Loans, interest, savings, and budgeting made simple.",
    icon: Landmark,
  },
  {
    slug: "health",
    name: "Health",
    description: "BMI, calories, body metrics, and wellness estimates.",
    icon: Activity,
  },
  {
    slug: "date-time",
    name: "Date & Time",
    description: "Age, durations, deadlines, and date differences.",
    icon: CalendarClock,
  },
  {
    slug: "unit-conversion",
    name: "Unit Conversion",
    description: "Convert length, weight, temperature, and more.",
    icon: Ruler,
  },
  {
    slug: "everyday",
    name: "Everyday",
    description: "Practical tools for shopping, tips, and daily decisions.",
    icon: Home,
  },
]

export const calculators: CalculatorMeta[] = [
  {
    id: "percentage",
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    summary: "Find percentages, increases, and decreases.",
    description:
      "Quickly calculate percentages, percentage change, and what percent one number is of another.",
    category: "math",
    icon: Percent,
    keywords: ["percent", "percentage", "%", "percent change", "increase", "decrease", "ratio", "proportion"],
    popular: true,
    status: "available",
    content: {
      intro:
        "Work out any percentage in seconds — a portion of a number, what percent one value is of another, or the percentage increase or decrease between two numbers.",
      howItWorks: [
        "A percentage expresses a number as a fraction of 100. To find X% of a value, convert the percentage to a decimal (divide by 100) and multiply by the value.",
        "To find what percent one number is of another, divide the part by the whole and multiply by 100.",
      ],
      formula: {
        expression: "Result = (Percentage ÷ 100) × Value",
        where: [
          { symbol: "Percentage", meaning: "The percent you want to apply" },
          { symbol: "Value", meaning: "The base number" },
        ],
      },
      example: {
        scenario: "What is 15% of 200?",
        steps: ["Convert 15% to a decimal: 15 ÷ 100 = 0.15", "Multiply by the value: 0.15 × 200 = 30"],
        result: "15% of 200 is 30.",
      },
      faqs: [
        {
          question: "How do I calculate a percentage increase?",
          answer:
            "Subtract the original value from the new value, divide the result by the original value, then multiply by 100.",
        },
        {
          question: "How do I turn a percentage into a decimal?",
          answer: "Divide the percentage by 100. For example, 25% becomes 0.25.",
        },
      ],
    },
  },
  {
    id: "age",
    slug: "age-calculator",
    name: "Age Calculator",
    summary: "Calculate your exact age from a birth date.",
    description:
      "Work out your precise age in years, months, and days from any birth date to today.",
    category: "date-time",
    icon: CalendarDays,
    keywords: ["age", "birthday", "born", "date of birth", "dob", "how old", "years months days"],
    popular: true,
    status: "available",
    content: {
      intro:
        "Enter a date of birth to find an exact age broken down into years, months, and days, measured to today or any date you choose.",
      howItWorks: [
        "The calculator counts the full years between the birth date and the target date, then the remaining whole months, then the leftover days — accounting for month lengths and leap years.",
      ],
      formula: {
        expression: "Age = Target Date − Birth Date",
        where: [
          { symbol: "Target Date", meaning: "Today, or a date you pick" },
          { symbol: "Birth Date", meaning: "The date of birth" },
        ],
      },
      example: {
        scenario: "Someone born on 1 Jan 2000, measured on 1 Jul 2024.",
        steps: ["Full years elapsed: 24", "Remaining months after the last birthday: 6", "Remaining days: 0"],
        result: "The age is 24 years, 6 months, and 0 days.",
      },
      faqs: [
        {
          question: "Does it account for leap years?",
          answer: "Yes. Day and month counts use real calendar lengths, so leap years are handled correctly.",
        },
      ],
    },
  },
  {
    id: "bmi",
    slug: "bmi-calculator",
    name: "BMI Calculator",
    summary: "Check your body mass index.",
    description:
      "Estimate your Body Mass Index from your height and weight, in metric or imperial units.",
    category: "health",
    icon: HeartPulse,
    keywords: ["bmi", "body mass index", "weight", "height", "obesity", "overweight", "healthy weight"],
    popular: true,
    status: "available",
    content: {
      intro:
        "Body Mass Index is a quick screening number that relates your weight to your height. Enter both in metric or imperial units to see your BMI and category.",
      howItWorks: [
        "BMI divides weight in kilograms by height in metres squared. The result maps to broad categories: underweight, normal, overweight, and obese.",
        "BMI is a screening tool, not a diagnosis — it does not distinguish muscle from fat. Treat it as a starting point, not medical advice.",
      ],
      formula: {
        expression: "BMI = weight (kg) ÷ height (m)²",
        where: [
          { symbol: "weight", meaning: "Body weight in kilograms" },
          { symbol: "height", meaning: "Height in metres" },
        ],
      },
      example: {
        scenario: "A person weighing 70 kg who is 1.75 m tall.",
        steps: ["Square the height: 1.75 × 1.75 = 3.0625", "Divide weight by that: 70 ÷ 3.0625 ≈ 22.9"],
        result: "A BMI of about 22.9, which falls in the normal range.",
      },
      faqs: [
        {
          question: "What is a healthy BMI range?",
          answer:
            "For most adults a BMI between 18.5 and 24.9 is considered normal, but individual health depends on many factors.",
        },
      ],
    },
  },
  {
    id: "discount",
    slug: "discount-calculator",
    name: "Discount Calculator",
    summary: "See sale prices and how much you save.",
    description:
      "Calculate the final price after a discount and the total amount you save on any purchase.",
    category: "everyday",
    icon: Tag,
    keywords: ["discount", "sale", "percent off", "savings", "deal", "markdown", "coupon", "price"],
    popular: true,
    status: "available",
    content: {
      intro:
        "Enter an original price and a discount percentage to instantly see the sale price and how much you save.",
      howItWorks: [
        "Multiply the original price by the discount percentage to find the amount saved, then subtract that from the original price to get the final price.",
      ],
      formula: {
        expression: "Final Price = Original Price × (1 − Discount ÷ 100)",
        where: [
          { symbol: "Original Price", meaning: "Price before the discount" },
          { symbol: "Discount", meaning: "The percent off" },
        ],
      },
      example: {
        scenario: "A $80 item with 25% off.",
        steps: ["Amount saved: 80 × 0.25 = $20", "Final price: 80 − 20 = $60"],
        result: "You pay $60 and save $20.",
      },
      faqs: [
        {
          question: "Can I stack two discounts?",
          answer:
            "Apply them one after another: take the first discount, then apply the second to the already-reduced price rather than adding the percentages.",
        },
      ],
    },
  },
  {
    id: "loan",
    slug: "loan-calculator",
    name: "Loan Calculator",
    summary: "Estimate monthly loan payments.",
    description:
      "Estimate monthly payments, total interest, and total cost for a loan based on rate and term.",
    category: "finance",
    icon: Wallet,
    keywords: ["loan", "mortgage", "emi", "monthly payment", "interest", "amortization", "repayment", "finance"],
    popular: true,
    status: "available",
    content: {
      intro:
        "Estimate your monthly payment on a fixed-rate loan from the amount borrowed, the annual interest rate, and the term in years.",
      howItWorks: [
        "The standard amortization formula spreads the loan plus interest evenly across every month of the term, so each payment is identical.",
        "Early payments are mostly interest; later payments are mostly principal, but the monthly amount stays the same.",
      ],
      formula: {
        expression: "M = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)",
        where: [
          { symbol: "M", meaning: "Monthly payment" },
          { symbol: "P", meaning: "Principal (amount borrowed)" },
          { symbol: "r", meaning: "Monthly interest rate (annual ÷ 12)" },
          { symbol: "n", meaning: "Total number of monthly payments" },
        ],
      },
      example: {
        scenario: "$20,000 borrowed at 6% annual interest over 5 years.",
        steps: [
          "Monthly rate: 6% ÷ 12 = 0.5% (0.005)",
          "Number of payments: 5 × 12 = 60",
          "Apply the amortization formula",
        ],
        result: "A monthly payment of roughly $386.66.",
      },
      faqs: [
        {
          question: "Does this include taxes or insurance?",
          answer:
            "No. It estimates principal and interest only. Real loan costs can include taxes, insurance, and fees.",
        },
      ],
    },
  },
  {
    id: "date",
    slug: "date-calculator",
    name: "Date Calculator",
    summary: "Add, subtract, and compare dates.",
    description:
      "Add or subtract days from a date and find the number of days between two dates.",
    category: "date-time",
    icon: CalendarClock,
    keywords: ["date", "days between", "add days", "subtract days", "duration", "deadline", "countdown"],
    popular: true,
    status: "available",
    content: {
      intro:
        "Add or subtract a number of days from any date, or find exactly how many days fall between two dates.",
      howItWorks: [
        "To shift a date, add or subtract the number of days and let the calendar roll months and years over automatically.",
        "To find a duration, count the whole days from the earlier date up to the later date.",
      ],
      formula: {
        expression: "Days Between = Later Date − Earlier Date",
        where: [
          { symbol: "Later Date", meaning: "The end date" },
          { symbol: "Earlier Date", meaning: "The start date" },
        ],
      },
      example: {
        scenario: "How many days from 1 Mar 2024 to 15 Mar 2024?",
        steps: ["Subtract the earlier date from the later date", "15 − 1 = 14"],
        result: "There are 14 days between the two dates.",
      },
      faqs: [
        {
          question: "Are both the start and end dates counted?",
          answer:
            "By convention the difference counts full days between the dates, so the start date itself is not double-counted.",
        },
      ],
    },
  },
]

export const genericCalculatorIcon: LucideIcon = Calculator

/* ── Lookups ─────────────────────────────────────────────────────────────── */

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return calculators.find((c) => c.slug === slug)
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

/** Type guard: is this slug one of our categories? */
export function isCategorySlug(slug: string): slug is CategorySlug {
  return categories.some((c) => c.slug === slug)
}

export function getCalculatorsByCategory(slug: CategorySlug): CalculatorMeta[] {
  return calculators.filter((c) => c.category === slug)
}

export function getPopularCalculators(): CalculatorMeta[] {
  return calculators.filter((c) => c.popular)
}

export function countByCategory(slug: CategorySlug): number {
  return getCalculatorsByCategory(slug).length
}

/** Canonical URL for a category listing page. */
export function categoryPath(slug: CategorySlug): string {
  return `/calculators/${slug}`
}

/** Canonical URL for a calculator page. */
export function calculatorPath(slug: string): string {
  return `/calculators/${slug}`
}

/* ── Search ──────────────────────────────────────────────────────────────── */

export type CalculatorFilter = CategorySlug | "all"

/**
 * Search across name, summary, description, category name, and keywords.
 *
 * Designed to scale: matching is done with a precomputed lowercase haystack
 * per calculator, so it stays O(n) over the registry and can be swapped for a
 * prebuilt index later without changing callers.
 */
export function searchCalculators(
  query: string,
  filter: CalculatorFilter = "all",
): CalculatorMeta[] {
  const q = query.trim().toLowerCase()
  return calculators.filter((calc) => {
    if (filter !== "all" && calc.category !== filter) return false
    if (!q) return true
    return calculatorHaystack(calc).includes(q)
  })
}

function calculatorHaystack(calc: CalculatorMeta): string {
  const categoryName = getCategory(calc.category)?.name ?? ""
  return [
    calc.name,
    calc.summary,
    calc.description,
    categoryName,
    ...calc.keywords,
  ]
    .join(" ")
    .toLowerCase()
}
