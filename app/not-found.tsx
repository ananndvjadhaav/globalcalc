import Link from "next/link"

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm font-medium uppercase tracking-widest text-primary">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
        We couldn&apos;t find the page you were looking for. It may have moved or
        never existed.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back home
        </Link>
        <Link
          href="/calculators"
          className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Browse calculators
        </Link>
      </div>
    </main>
  )
}
