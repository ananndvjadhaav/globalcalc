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
  /** Optional heading shown above the formula when a calculator has more than one mode. */
  label?: string
  /** The formula itself, shown in a monospace block. */
  expression: string
  /** Optional legend describing each symbol in the expression. */
  where?: FormulaTerm[]
}

export interface WorkedExample {
  /** Optional heading shown above the example when a calculator has more than one mode. */
  label?: string
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
  /** A single formula, or one per mode for calculators with multiple modes. */
  formula?: CalculatorFormula | CalculatorFormula[]
  /** A single worked example, or one per mode for calculators with multiple modes. */
  example?: WorkedExample | WorkedExample[]
  /** Important caveats, assumptions, or things the calculator doesn't account for. */
  limitations?: string[]
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
    seoTitle: "Percentage Calculator: % of a Number, Percent Change & More",
    seoDescription:
      "Find what X% of a number is, work out what percent one value is of another, or calculate a percentage increase or decrease — with clear steps and instant results.",
    content: {
      intro:
        "This calculator covers three common percentage questions: finding X% of a number, finding what percent one number is of another, and finding the percentage increase or decrease between two values. Pick the mode that matches your question above the inputs.",
      howItWorks: [
        "\"% of a number\" converts the percentage to a decimal (divide by 100) and multiplies it by the value — this answers questions like \"what is 15% of 200?\"",
        "\"X is what % of Y\" divides the part by the whole and multiplies by 100 — this answers questions like \"50 out of 200 is what percent?\"",
        "\"Increase / decrease\" compares a starting (original) value to an ending (new) value and expresses the change as a percentage of the original — a positive result is an increase, a negative result is a decrease.",
        "The result updates instantly as you type, and the label above the result always states which of the three questions it's answering.",
      ],
      formula: [
        {
          label: "% of a number",
          expression: "Result = (X ÷ 100) × Y",
          where: [
            { symbol: "X", meaning: "The percentage you want to apply" },
            { symbol: "Y", meaning: "The base value" },
          ],
        },
        {
          label: "X is what % of Y",
          expression: "Result (%) = (X ÷ Y) × 100",
          where: [
            { symbol: "X", meaning: "The part" },
            { symbol: "Y", meaning: "The whole (cannot be 0)" },
          ],
        },
        {
          label: "Percentage increase / decrease",
          expression: "Change (%) = ((New − Old) ÷ Old) × 100",
          where: [
            { symbol: "Old", meaning: "The starting value (cannot be 0)" },
            { symbol: "New", meaning: "The ending value" },
          ],
        },
      ],
      example: [
        {
          label: "% of a number",
          scenario: "What is 15% of 200?",
          steps: ["Convert 15% to a decimal: 15 ÷ 100 = 0.15", "Multiply by the value: 0.15 × 200 = 30"],
          result: "15% of 200 is 30.",
        },
        {
          label: "X is what % of Y",
          scenario: "50 is what percent of 200?",
          steps: ["Divide the part by the whole: 50 ÷ 200 = 0.25", "Multiply by 100: 0.25 × 100 = 25"],
          result: "50 is 25% of 200.",
        },
        {
          label: "Percentage increase / decrease",
          scenario: "A shirt's price rose from $40 to $52. What's the percentage increase?",
          steps: [
            "Find the difference: 52 − 40 = 12",
            "Divide by the original value: 12 ÷ 40 = 0.3",
            "Multiply by 100: 0.3 × 100 = 30",
          ],
          result: "That's a 30% increase.",
        },
      ],
      limitations: [
        "In \"X is what % of Y\" mode, Y (the whole) can't be 0 — dividing by zero has no defined percentage.",
        "In \"increase / decrease\" mode, the original value can't be 0, for the same reason — percentage change from zero is undefined.",
        "Results are shown with extra decimal places for precision; round to however many decimals make sense for your situation (currency, for example, usually rounds to 2).",
      ],
      faqs: [
        {
          question: "What's the difference between 'percentage of' and 'percentage change'?",
          answer:
            "\"Percentage of\" finds a portion of a single number (e.g. 15% of 200). \"Percentage change\" compares two different values — an original and a new one — and tells you how much bigger or smaller the new value is, as a percentage.",
        },
        {
          question: "How do I calculate a percentage increase or decrease?",
          answer:
            "Subtract the original value from the new value, divide the result by the original value, then multiply by 100. A positive result is an increase; a negative result is a decrease.",
        },
        {
          question: "Why can't the original value be zero in percentage change?",
          answer:
            "Percentage change is calculated relative to the original value, so dividing by zero would be mathematically undefined. Use a nonzero starting value.",
        },
        {
          question: "Is a 50% decrease the same as dividing by 2?",
          answer:
            "Yes — reducing a value by 50% leaves the other 50%, which is the same as dividing the original value by 2.",
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
    seoTitle: "Age Calculator: Find Your Exact Age in Years, Months & Days",
    seoDescription:
      "Calculate your exact age from any date of birth to today or a chosen date, including total months, weeks, and days — accurate for leap years.",
    content: {
      intro:
        "Enter a date of birth to find an exact age broken down into years, months, and days, measured to today or any date you choose, along with the same age expressed in total months, weeks, and days.",
      howItWorks: [
        "The calculator first counts the number of full years between the birth date and the target date. It then counts the remaining whole months after the last birthday, and finally the leftover days after the last full month — using real calendar month lengths, so shorter months like February are handled correctly.",
        "If the day-of-month of the target date is earlier than the birth date's day-of-month, the calculator borrows a month and adds the number of days in the previous calendar month, which is how leap years are automatically accounted for.",
        "\"Total months\", \"total weeks\", and \"total days\" convert the same age into a single running figure — useful for comparing ages, tracking milestones like a baby's age in weeks, or filling in forms that ask for age in months.",
      ],
      formula: {
        expression: "Age = (Target Date − Birth Date), split into whole years, months, and days",
        where: [
          { symbol: "Target Date", meaning: "Today, or a date you pick" },
          { symbol: "Birth Date", meaning: "The date of birth (must not be after the target date)" },
        ],
      },
      example: {
        scenario: "Someone born on 1 Jan 2000, measured on 1 Jul 2024.",
        steps: [
          "Full years elapsed: 24",
          "Remaining months after the last birthday: 6",
          "Remaining days: 0",
          "Expressed as totals: 294 months, 1,278 weeks, or 8,948 days",
        ],
        result: "The age is 24 years, 6 months, and 0 days (294 total months).",
      },
      limitations: [
        "The date of birth must be on or before the target date — future birth dates aren't supported.",
        "Dates are compared as whole calendar days; the calculator doesn't account for time zones or the time of day someone was born.",
        "\"Total weeks\" and \"total days\" are whole numbers, so they're a close approximation rather than a to-the-second count.",
      ],
      faqs: [
        {
          question: "Does it account for leap years?",
          answer: "Yes. Day and month counts use real calendar lengths, so leap years are handled correctly.",
        },
        {
          question: "What do 'total months', 'total weeks', and 'total days' mean?",
          answer:
            "They express the same age as a single number instead of a years/months/days breakdown — for example, 2 years and 3 months is also shown as 27 total months, which can be handy for tracking a baby's age or filling out forms.",
        },
        {
          question: "Can I calculate age as of a date other than today?",
          answer:
            "Yes — change the 'Age as of' field to any date to see the age on that specific date instead of today.",
        },
        {
          question: "Why might my age look one day different around my birthday?",
          answer:
            "Ages are compared using calendar days only, so if a birth time is recorded near midnight, the exact calendar day can depend on the time zone used when it was recorded.",
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
    seoTitle: "BMI Calculator: Check Your Body Mass Index (Metric & Imperial)",
    seoDescription:
      "Calculate your BMI from height and weight in metric or imperial units and see which category it falls into, along with what BMI does and doesn't tell you.",
    content: {
      intro:
        "Body Mass Index is a quick screening number that relates your weight to your height. Enter your weight and height in either metric or imperial units to see your BMI and which of four standard categories it falls into.",
      howItWorks: [
        "BMI divides weight by height squared. In metric units that's kilograms divided by metres squared; in imperial units this calculator uses the equivalent formula of 703 × pounds divided by inches squared — both give the same BMI for the same body size.",
        "The result is mapped to four widely used categories: Underweight (BMI below 18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obese (30 and above).",
        "BMI is a screening tool, not a diagnosis — it doesn't distinguish muscle from fat, so a very muscular person can show a higher BMI without carrying excess body fat. Treat the result as a general starting point, not medical advice.",
      ],
      formula: [
        {
          label: "Metric",
          expression: "BMI = weight (kg) ÷ height (m)²",
          where: [
            { symbol: "weight", meaning: "Body weight in kilograms" },
            { symbol: "height", meaning: "Height in metres" },
          ],
        },
        {
          label: "Imperial",
          expression: "BMI = 703 × weight (lb) ÷ height (in)²",
          where: [
            { symbol: "weight", meaning: "Body weight in pounds" },
            { symbol: "height", meaning: "Height in inches" },
          ],
        },
      ],
      example: [
        {
          label: "Metric",
          scenario: "A person weighing 70 kg who is 1.75 m tall.",
          steps: ["Square the height: 1.75 × 1.75 = 3.0625", "Divide weight by that: 70 ÷ 3.0625 ≈ 22.9"],
          result: "A BMI of about 22.9, which falls in the normal weight range.",
        },
        {
          label: "Imperial",
          scenario: "A person weighing 154 lb who is 5 ft 9 in (69 in) tall.",
          steps: [
            "Square the height in inches: 69 × 69 = 4,761",
            "Multiply weight by 703: 154 × 703 = 108,262",
            "Divide: 108,262 ÷ 4,761 ≈ 22.7",
          ],
          result: "A BMI of about 22.7, which falls in the normal weight range.",
        },
      ],
      limitations: [
        "BMI doesn't measure body fat directly — it can't tell the difference between weight from muscle, bone, and fat, so athletic or muscular people are sometimes categorized as 'overweight' despite low body fat.",
        "The standard categories used here are based on adult population data and may not be appropriate for children, teenagers, pregnant or breastfeeding women, or frail older adults.",
        "Healthy BMI ranges can also vary somewhat by ethnicity and body frame; use this result as one general indicator, not a complete health assessment.",
        "If you have concerns about your weight or health, talk to a healthcare professional rather than relying on BMI alone.",
      ],
      faqs: [
        {
          question: "What is a healthy BMI range?",
          answer:
            "For most adults, a BMI between 18.5 and 24.9 is considered a normal weight, 25–29.9 is considered overweight, and 30 or above is considered obese — though individual health depends on many other factors.",
        },
        {
          question: "Does BMI account for muscle mass?",
          answer:
            "No. BMI only uses weight and height, so it can't distinguish muscle from fat. Very muscular or athletic people may show a higher BMI without excess body fat.",
        },
        {
          question: "Is BMI accurate for children or teenagers?",
          answer:
            "Not directly — children and teens are usually assessed with age- and sex-specific BMI percentile charts rather than the fixed adult categories used here.",
        },
        {
          question: "Should I use metric or imperial units?",
          answer:
            "Either — the calculator gives the same BMI either way. Choose whichever units your height and weight are already in.",
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
    seoTitle: "Discount Calculator: Find Sale Price and Savings",
    seoDescription:
      "Enter an original price and discount percentage to see the final sale price and exactly how much you save — quick math for shopping and sales.",
    content: {
      intro:
        "Enter an original price and a discount percentage to instantly see the sale price, the discount amount, and how much you save on any purchase.",
      howItWorks: [
        "The discount amount is the original price multiplied by the discount percentage. Subtracting that amount from the original price gives the final price you actually pay.",
        "'You save' shows that same discount amount in currency, so you can see both the percentage off and the exact amount it comes to.",
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
      limitations: [
        "This is the pre-tax price — sales tax, shipping, or service fees aren't included and will change the total you actually pay.",
        "For two discounts applied one after another (e.g. 20% off, then an extra 10% off), apply them in sequence rather than adding the percentages — 20% + 10% off is not the same as 30% off, since the second discount applies to an already-reduced price.",
        "The discount percentage can't exceed 100%, since that would mean the item costs less than $0.",
      ],
      faqs: [
        {
          question: "Can I stack two discounts, like 20% and then an extra 10%?",
          answer:
            "Apply them one after another: take the first discount off the original price, then apply the second discount to that new, lower price — don't just add the two percentages together.",
        },
        {
          question: "Is a 25% discount the same as paying 75% of the price?",
          answer: "Yes — taking 25% off is mathematically the same as paying 75% of the original price.",
        },
        {
          question: "Does this include sales tax?",
          answer:
            "No, this calculates the discount on the listed price only. Tax is usually added after the discount, so your actual total may be higher.",
        },
        {
          question: "How do I find the original price if I only know the sale price and discount?",
          answer:
            "Divide the sale price by (1 − discount ÷ 100). For example, a $60 sale price after a 25% discount means the original price was 60 ÷ 0.75 = $80.",
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
    seoTitle: "Loan Calculator: Estimate Monthly Payments and Total Interest",
    seoDescription:
      "Estimate your monthly loan payment, total interest, and total cost from the loan amount, interest rate, and term — based on standard amortization.",
    content: {
      intro:
        "Estimate your monthly payment on a fixed-rate loan from the amount borrowed, the annual interest rate, and the term in years — along with the total interest and total amount you'll pay over the life of the loan.",
      howItWorks: [
        "The standard amortization formula spreads the loan plus interest evenly across every monthly payment, so each payment is the same amount for the full term.",
        "Early payments are mostly interest, and later payments are mostly principal, even though the monthly amount you pay never changes.",
        "'Total payment' is the monthly payment multiplied by the number of payments; 'total interest' is the total payment minus the amount you originally borrowed — it's the extra cost of borrowing.",
        "If you enter a 0% interest rate, there's no interest to amortize, so the payment is simply the loan amount divided evenly across the number of payments.",
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
          "Apply the amortization formula to get the monthly payment: about $386.66",
          "Total payment: $386.66 × 60 ≈ $23,199.60",
          "Total interest: $23,199.60 − $20,000 ≈ $3,199.60",
        ],
        result: "A monthly payment of roughly $386.66, totalling about $23,199.60 over 5 years — around $3,199.60 in interest.",
      },
      limitations: [
        "This assumes a fixed interest rate for the entire term; it doesn't model adjustable-rate loans where the rate can change over time.",
        "Only principal and interest are calculated — property taxes, insurance (like PMI), origination fees, and other charges aren't included and can add meaningfully to your real monthly cost.",
        "Payments are assumed to be made on schedule every month with no extra or early payments; paying extra would reduce the total interest below this estimate.",
      ],
      faqs: [
        {
          question: "Does this include taxes or insurance?",
          answer:
            "No. It estimates principal and interest only. Real loan costs, especially mortgages, often include taxes, insurance, and fees on top of this.",
        },
        {
          question: "What does 'total interest' represent?",
          answer:
            "It's the extra amount you pay on top of the amount you borrowed — the total cost of borrowing over the full term.",
        },
        {
          question: "How does the loan term affect my monthly payment?",
          answer:
            "A longer term spreads the same loan over more payments, so each monthly payment is smaller — but you pay more total interest because the balance is outstanding for longer.",
        },
        {
          question: "What happens if I enter a 0% interest rate?",
          answer:
            "With 0% interest, there's no interest to add, so the monthly payment is simply the loan amount divided evenly by the number of payments, and total interest is $0.",
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
    seoTitle: "Date Calculator: Days Between Dates or Add/Subtract Days",
    seoDescription:
      "Find the number of days between two dates, or add or subtract days from a date to find a new one — with clear results for both.",
    content: {
      intro:
        "Add or subtract a number of days from any date, or find exactly how many days fall between two dates — switch modes above the inputs.",
      howItWorks: [
        "In 'Difference' mode, the calculator counts the whole days between the two dates you enter. It automatically works out which date is earlier, so it doesn't matter which one you type into 'start' versus 'end'.",
        "In 'Add / subtract days' mode, the calculator adds or subtracts the number of days you enter from the start date, letting the calendar roll over into the next month or year automatically using real month lengths.",
        "The difference result also breaks the same span down into total weeks and an approximate years/months/days figure, so you can read it however is most useful.",
      ],
      formula: [
        {
          label: "Difference between two dates",
          expression: "Days Between = |Later Date − Earlier Date|",
          where: [
            { symbol: "Later Date", meaning: "The more recent of the two dates" },
            { symbol: "Earlier Date", meaning: "The other date" },
          ],
        },
        {
          label: "Add or subtract days",
          expression: "Result Date = Start Date ± Number of Days",
          where: [
            { symbol: "Start Date", meaning: "The date you enter" },
            { symbol: "Number of Days", meaning: "Always positive — use the Add/Subtract toggle for direction" },
          ],
        },
      ],
      example: [
        {
          label: "Difference",
          scenario: "How many days from 1 Mar 2024 to 15 Mar 2024?",
          steps: ["Subtract the earlier date from the later date", "15 − 1 = 14"],
          result: "There are 14 days between the two dates.",
        },
        {
          label: "Add days",
          scenario: "What date is 30 days after 10 Jan 2024?",
          steps: [
            "January has 31 days, so 21 days remain in January after the 10th",
            "The remaining 9 days roll into February",
            "10 Jan + 30 days = 9 Feb 2024",
          ],
          result: "30 days after 10 Jan 2024 is 9 Feb 2024.",
        },
      ],
      limitations: [
        "In Difference mode, the calculator always returns a positive number of days regardless of which date you enter first — it automatically works out which date is earlier.",
        "In Add/Subtract mode, enter the number of days as a positive number and use the Add/Subtract toggle to choose the direction; negative numbers aren't accepted.",
        "Dates are compared as calendar days without a time-of-day component, so results represent whole-day differences.",
      ],
      faqs: [
        {
          question: "Are both the start and end dates counted in the difference?",
          answer:
            "The calculator counts the number of days between the two dates, so 1 Mar to 15 Mar 2024 is 14 days — the start date itself isn't counted as a separate day, only the days that have elapsed since it.",
        },
        {
          question: "Can I subtract days instead of adding them?",
          answer:
            "Yes — switch to 'Add / subtract days' mode and use the Subtract toggle instead of Add; the number of days you enter is still positive.",
        },
        {
          question: "Does it matter which date I put in 'start' vs 'end' for the difference?",
          answer:
            "No — the calculator compares both dates and always reports the difference as a positive number of days, no matter which one you enter first.",
        },
        {
          question: "Does adding days account for leap years and different month lengths?",
          answer:
            "Yes — the calculator rolls over into the next month or year automatically using real calendar lengths, so leap years like February 2024 are handled correctly.",
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
