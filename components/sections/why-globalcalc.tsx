import { Zap, ShieldCheck, Smartphone, BadgeDollarSign } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Fast & Simple",
    description:
      "Clean, focused tools that give you an answer in seconds, with no clutter or distractions.",
  },
  {
    icon: ShieldCheck,
    title: "Accurate Results",
    description:
      "Every calculator uses clear, well-tested formulas so you can trust the numbers you get.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description:
      "Designed mobile-first, GlobalCalc works smoothly on your phone, tablet, and desktop.",
  },
  {
    icon: BadgeDollarSign,
    title: "Free to Use",
    description:
      "All calculators are completely free and require no account or sign-up to use.",
  },
]

export function WhyGlobalCalc() {
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
      aria-labelledby="why-heading"
    >
      <div className="max-w-2xl">
        <h2
          id="why-heading"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Why GlobalCalc
        </h2>
        <p className="mt-2 text-pretty text-base leading-relaxed text-muted-foreground">
          Built to be the reliable, no-nonsense place for everyday calculations.
        </p>
      </div>
      <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div key={feature.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
