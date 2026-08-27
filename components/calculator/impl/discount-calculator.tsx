"use client"

import { useState } from "react"
import { CalculatorInterface } from "@/components/calculator/calculator-interface"
import {
  Field,
  TextInput,
  Select,
  ErrorNote,
  EmptyResult,
  ResultCallout,
  ResultList,
  ResultStat,
  parseNum,
  fmt,
  money,
} from "./fields"
import { SmartInsight } from "./insight"
import { useCurrency, CURRENCIES } from "@/lib/currency"

export function DiscountCalculator() {
  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState("")
  const [currency, setCurrency] = useCurrency()

  const p = parseNum(price)
  const d = parseNum(discount)

  const inputs = (
    <div className="space-y-5">
      <Field
        label="Currency"
        htmlFor="disc-currency"
        hint="Detected from your browser — change anytime."
      >
        <Select
          id="disc-currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as typeof currency)}
          data-testid="disc-currency-select"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Original price" htmlFor="disc-price">
        <TextInput
          id="disc-price"
          type="number"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="80"
          data-testid="disc-input-price"
        />
      </Field>
      <Field label="Discount (%)" htmlFor="disc-percent">
        <TextInput
          id="disc-percent"
          type="number"
          inputMode="decimal"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="25"
          data-testid="disc-input-percent"
        />
      </Field>
    </div>
  )

  return <CalculatorInterface inputs={inputs} result={renderResult()} />

  function renderResult() {
    if (p === null || d === null) {
      return (
        <EmptyResult>
          Enter a price and a discount percentage to see the savings.
        </EmptyResult>
      )
    }
    if (p < 0) {
      return <ErrorNote>The original price can&apos;t be negative.</ErrorNote>
    }
    if (d < 0) {
      return <ErrorNote>The discount percentage can&apos;t be negative.</ErrorNote>
    }
    if (d > 100) {
      return <ErrorNote>The discount can&apos;t be more than 100%.</ErrorNote>
    }

    const saved = p * (d / 100)
    const final = p - saved
    const payingPct = 100 - d

    return (
      <div>
        <ResultCallout
          label="Final price"
          value={money(final, currency)}
          sublabel={`You save ${money(saved, currency)} (${fmt(d)}%)`}
        />
        <ResultList>
          <ResultStat label="Original price" value={money(p, currency)} />
          <ResultStat label="Discount amount" value={money(saved, currency)} />
          <ResultStat label="Final price" value={money(final, currency)} />
        </ResultList>
        <SmartInsight>
          You&apos;re paying {fmt(payingPct)}% of the original price — that&apos;s{" "}
          {money(final, currency)} instead of {money(p, currency)}, a saving of{" "}
          {money(saved, currency)}.
        </SmartInsight>
      </div>
    )
  }
}
