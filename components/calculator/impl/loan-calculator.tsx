"use client"

import { useState } from "react"
import { CalculatorInterface } from "@/components/calculator/calculator-interface"
import {
  Field,
  TextInput,
  ErrorNote,
  EmptyResult,
  ResultCallout,
  ResultList,
  ResultStat,
  parseNum,
  money,
} from "./fields"

export function LoanCalculator() {
  const [amount, setAmount] = useState("")
  const [rate, setRate] = useState("")
  const [years, setYears] = useState("")

  const p = parseNum(amount)
  const annualRate = parseNum(rate)
  const term = parseNum(years)

  const inputs = (
    <div className="space-y-5">
      <Field label="Loan amount" htmlFor="loan-amount">
        <TextInput
          id="loan-amount"
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="20000"
          data-testid="loan-input-amount"
        />
      </Field>
      <Field
        label="Annual interest rate (%)"
        htmlFor="loan-rate"
        hint="Use 0 for an interest-free loan."
      >
        <TextInput
          id="loan-rate"
          type="number"
          inputMode="decimal"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="6"
          data-testid="loan-input-rate"
        />
      </Field>
      <Field label="Loan term (years)" htmlFor="loan-years">
        <TextInput
          id="loan-years"
          type="number"
          inputMode="decimal"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          placeholder="5"
          data-testid="loan-input-years"
        />
      </Field>
    </div>
  )

  return <CalculatorInterface inputs={inputs} result={renderResult()} />

  function renderResult() {
    if (p === null || annualRate === null || term === null) {
      return (
        <EmptyResult>
          Enter the amount, interest rate, and term to estimate your payment.
        </EmptyResult>
      )
    }
    if (p <= 0) {
      return <ErrorNote>The loan amount must be greater than zero.</ErrorNote>
    }
    if (annualRate < 0) {
      return <ErrorNote>The interest rate can&apos;t be negative.</ErrorNote>
    }
    if (term <= 0) {
      return <ErrorNote>The loan term must be greater than zero.</ErrorNote>
    }

    const n = term * 12
    const r = annualRate / 100 / 12

    // Zero-interest loans are a straight division; the amortization formula
    // divides by zero when r === 0.
    const monthly = r === 0 ? p / n : (p * r * (1 + r) ** n) / ((1 + r) ** n - 1)
    const total = monthly * n
    const interest = total - p

    return (
      <div>
        <ResultCallout
          label="Monthly payment"
          value={money(monthly)}
          sublabel={`over ${term} ${term === 1 ? "year" : "years"} (${n} payments)`}
        />
        <ResultList>
          <ResultStat label="Principal" value={money(p)} />
          <ResultStat label="Total interest" value={money(interest)} />
          <ResultStat label="Total payment" value={money(total)} />
        </ResultList>
      </div>
    )
  }
}
