interface LegalBlock {
  heading: string
  body: string[]
}

export function LegalContent({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="space-y-10">
        {blocks.map((block) => (
          <section key={block.heading}>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {block.heading}
            </h2>
            <div className="mt-3 space-y-4 text-base leading-relaxed text-muted-foreground">
              {block.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
