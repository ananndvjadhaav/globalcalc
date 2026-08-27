"use client"

import { useState } from "react"
import { CalculatorInterface } from "@/components/calculator/calculator-interface"
import {
  Field,
  TextInput,
  Segmented,
  ErrorNote,
  EmptyResult,
  ResultCallout,
  parseNum,
  fmt,
} from "./fields"
import { SmartInsight } from "./insight"

type Mode = "of" | "isWhat" | "change"

const LABELS: Record<Mode, { a: string; aHint: string; b: string; bHint: string }> = {
  of: {
    a: "Percentage (%)",
    aHint: "e.g. 15 for 15%",
    b: "Of value",
    bHint: "The base number",
  },
  isWhat: {
    a: "Value (X)",
    aHint: "The part",
    b: "Total (Y)",
    bHint: "The whole",
  },
  change: {
    a: "From (original value)",
    aHint: "Starting number",
    b: "To (new value)",
    bHint: "Ending number",
  },
}

export function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("of")
  const [a, setA] = useState("")
  const [b, setB] = useState("")

  const x = parseNum(a)
  const y = parseNum(b)
  const labels = LABELS[mode]

  const inputs = (
    <div className="space-y-5">
      <Segmented<Mode>
        ariaLabel="Percentage calculation type"
        value={mode}
        onChange={setMode}
        options={[
          { value: "of", label: "% of a number" },
          { value: "isWhat", label: "X is what % of Y" },
          { value: "change", label: "Increase / decrease" },
        ]}
      />
      <Field label={labels.a} htmlFor="pct-a" hint={labels.aHint}>
        <TextInput
          id="pct-a"
          type="number"
          inputMode="decimal"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="0"
          data-testid="pct-input-a"
        />
      </Field>
      <Field label={labels.b} htmlFor="pct-b" hint={labels.bHint}>
        <TextInput
          id="pct-b"
          type="number"
          inputMode="decimal"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="0"
          data-testid="pct-input-b"
        />
      </Field>
    </div>
  )

  const result = renderResult()

  return <CalculatorInterface inputs={inputs} result={result} />

  function renderResult() {
    if (x === null || y === null) {
      return <EmptyResult>Enter both values to see the result.</EmptyResult>
    }
    if (mode === "isWhat" && y === 0) {
      return <ErrorNote>The total (Y) can&apos;t be zero.</ErrorNote>
    }
    if (mode === "change" && x === 0) {
      return (
        <ErrorNote>
          The original value can&apos;t be zero when measuring a percentage
          change.
        </ErrorNote>
      )
    }

    if (mode === "of") {
      const r = (x / 100) * y
      return (
        <ResultCallout
          label={`${fmt(x)}% of ${fmt(y)}`}
          value={fmt(r, 4)}
        />
      )
    }

    if (mode === "isWhat") {
      const r = (x / y) * 100
      return (
        <ResultCallout
          label={`${fmt(x)} is`}
          value={`${fmt(r, 4)}%`}
          sublabel={`of ${fmt(y)}`}
        />
      )
    }

    const r = ((y - x) / x) * 100
    const dir = r > 0 ? "increase" : r < 0 ? "decrease" : "no change"
    const multiplier = 1 + r / 100
    return (
      <div>
        <ResultCallout
          label="Percentage change"
          value={r === 0 ? "0%" : `${fmt(Math.abs(r), 4)}%`}
          sublabel={`${dir} from ${fmt(x)} to ${fmt(y)}`}
        />
        <SmartInsight>
          That&apos;s equivalent to multiplying the original value by{" "}
          {multiplier.toFixed(2)}.
        </SmartInsight>
      </div>
    )
  }
}
