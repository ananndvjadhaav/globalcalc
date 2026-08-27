"use client"

import { useState } from "react"
import { CalculatorInterface } from "@/components/calculator/calculator-interface"
import {
  Field,
  TextInput,
  Select,
  Segmented,
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

type Purity = "24" | "22" | "21" | "18" | "14"
type DeductionMode = "grams" | "percent"

const PURITY_OPTIONS: { value: Purity; label: string }[] = [
  { value: "24", label: "24K" },
  { value: "22", label: "22K" },
  { value: "21", label: "21K" },
  { value: "18", label: "18K" },
  { value: "14", label: "14K" },
]

export function GoldLoanCalculator() {
  const [weight, setWeight] = useState("")
  const [purity, setPurity] = useState<Purity>("22")
  const [deductionMode, setDeductionMode] = useState<DeductionMode>("grams")
  const [deduction, setDeduction] = useState("")
  const [rate, setRate] = useState("")
  const [ltv, setLtv] = useState("")
  const [currency, setCurrency] = useCurrency()

  const grossWeight = parseNum(weight)
  const goldRate = parseNum(rate)
  const ltvPct = parseNum(ltv)
  const deductionInput = parseNum(deduction)

  const inputs = (
    <div className="space-y-5">
      <Field
        label="Currency"
        htmlFor="gold-currency"
        hint="Detected from your browser — change anytime."
      >
        <Select
          id="gold-currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as typeof currency)}
          data-testid="gold-currency-select"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Gross gold/jewellery weight (grams)" htmlFor="gold-weight">
        <TextInput
          id="gold-weight"
          type="number"
          inputMode="decimal"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="20"
          data-testid="gold-input-weight"
        />
      </Field>

      <Field label="Gold purity" htmlFor="gold-purity">
        <Select
          id="gold-purity"
          value={purity}
          onChange={(e) => setPurity(e.target.value as Purity)}
          data-testid="gold-select-purity"
        >
          {PURITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="space-y-3">
        <Segmented<DeductionMode>
          ariaLabel="Deduction unit"
          value={deductionMode}
          onChange={setDeductionMode}
          options={[
            { value: "grams", label: "Grams" },
            { value: "percent", label: "Percentage" },
          ]}
        />
        <Field
          label="Estimated deductions / non-gold material"
          htmlFor="gold-deduction"
          hint="Use this to estimate stones, fastenings, or other non-gold material that may be excluded from the assessed gold weight. Actual lender deductions may differ."
        >
          <TextInput
            id="gold-deduction"
            type="number"
            inputMode="decimal"
            value={deduction}
            onChange={(e) => setDeduction(e.target.value)}
            placeholder="0"
            data-testid="gold-input-deduction"
          />
        </Field>
      </div>

      <Field label="Gold valuation rate (per gram)" htmlFor="gold-rate">
        <TextInput
          id="gold-rate"
          type="number"
          inputMode="decimal"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="6000"
          data-testid="gold-input-rate"
        />
      </Field>

      <Field
        label="LTV (%)"
        htmlFor="gold-ltv"
        hint="LTV (loan-to-value) is the percentage of the assessed gold value that may be available as a loan. Actual limits vary by lender and local rules."
      >
        <TextInput
          id="gold-ltv"
          type="number"
          inputMode="decimal"
          value={ltv}
          onChange={(e) => setLtv(e.target.value)}
          placeholder="75"
          data-testid="gold-input-ltv"
        />
      </Field>
    </div>
  )

  return <CalculatorInterface inputs={inputs} result={renderResult()} />

  function renderResult() {
    if (grossWeight === null || goldRate === null || ltvPct === null) {
      return (
        <EmptyResult>
          Enter the gold weight, valuation rate, and LTV to estimate the loan
          amount.
        </EmptyResult>
      )
    }
    if (grossWeight <= 0) {
      return <ErrorNote>The gross weight must be greater than zero.</ErrorNote>
    }
    if (goldRate <= 0) {
      return (
        <ErrorNote>The gold valuation rate must be greater than zero.</ErrorNote>
      )
    }
    if (ltvPct <= 0 || ltvPct > 100) {
      return (
        <ErrorNote>
          LTV must be greater than 0% and no more than 100%.
        </ErrorNote>
      )
    }

    const deductionRaw = deductionInput ?? 0
    if (deductionRaw < 0) {
      return <ErrorNote>Deductions can&apos;t be negative.</ErrorNote>
    }

    const deductionGrams =
      deductionMode === "grams" ? deductionRaw : grossWeight * (deductionRaw / 100)

    if (deductionGrams >= grossWeight) {
      return (
        <ErrorNote>
          Deductions can&apos;t be greater than or equal to the gross weight —
          there would be no gold left to value.
        </ErrorNote>
      )
    }

    const netWeight = Math.max(0, grossWeight - deductionGrams)
    const purityKarat = Number(purity)
    const equivalent22k = netWeight * (purityKarat / 22)
    const goldValue = equivalent22k * goldRate
    const loanAmount = goldValue * (ltvPct / 100)

    return (
      <div>
        <ResultCallout
          label="Estimated loan amount"
          value={money(loanAmount, currency)}
          sublabel={`Based on ${fmt(ltvPct)}% LTV of the estimated gold value`}
        />
        <ResultList>
          <ResultStat label="Gross gold weight" value={`${fmt(grossWeight)} g`} />
          <ResultStat
            label="Estimated deductions"
            value={`−${fmt(deductionGrams)} g`}
          />
          <ResultStat label="Net gold weight" value={`${fmt(netWeight)} g`} />
          <ResultStat label="Purity" value={`${purity}K`} />
          <ResultStat
            label="22K-equivalent gold content"
            value={`${fmt(equivalent22k)} g`}
          />
          <ResultStat
            label="Estimated gold value"
            value={money(goldValue, currency)}
          />
          <ResultStat label="LTV" value={`${fmt(ltvPct)}%`} />
        </ResultList>
        <SmartInsight>
          Why is the estimated loan lower than the gold value? The estimated
          loan is based on the assessed gold value multiplied by the LTV you
          entered. Deductions, purity, and the valuation rate can all affect
          the final estimate.
        </SmartInsight>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Estimate only: actual gold-loan eligibility, valuation, deductions,
          LTV, and loan terms depend on the lender&apos;s assessment and
          applicable local rules. This calculator does not guarantee a loan
          offer.
        </p>
      </div>
    )
  }
}
