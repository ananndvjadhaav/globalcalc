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
  money,
} from "./fields"
import { SmartInsight } from "./insight"
import { useCurrency, CURRENCIES } from "@/lib/currency"

const MAX_SIMULATION_MONTHS = 1200

/**
 * Simulates paying an extra fixed amount every month on top of the
 * standard payment, month by month, until the balance reaches zero.
 * Purely additive to the existing amortization formula above — it does
 * not change the standard monthly payment, total, or interest figures.
 */
function simulateExtraPayment(
  principal: number,
  monthlyRate: number,
  standardMonthly: number,
  extraMonthly: number,
): { payoffMonths: number; totalInterestPaid: number } | null {
  if (!Number.isFinite(principal) || principal <= 0) return null
  if (!Number.isFinite(standardMonthly) || standardMonthly <= 0) return null
  if (!Number.isFinite(extraMonthly) || extraMonthly < 0) return null

  let balance = principal
  let totalInterestPaid = 0
  let months = 0
  const payment = standardMonthly + extraMonthly

  while (balance > 0 && months < MAX_SIMULATION_MONTHS) {
    const interestThisMonth = balance * monthlyRate
    let principalPortion = payment - interestThisMonth
    if (principalPortion <= 0) {
      // The payment doesn't even cover the interest — this loan can never be paid off this way.
      return null
    }
    if (principalPortion > balance) {
      principalPortion = balance
    }
    balance -= principalPortion
    totalInterestPaid += interestThisMonth
    months += 1
  }

  if (balance > 0) return null

  return { payoffMonths: months, totalInterestPaid }
}

export function LoanCalculator() {
  const [amount, setAmount] = useState("")
  const [rate, setRate] = useState("")
  const [years, setYears] = useState("")
  const [extraPayment, setExtraPayment] = useState("")
  const [currency, setCurrency] = useCurrency()

  const p = parseNum(amount)
  const annualRate = parseNum(rate)
  const term = parseNum(years)

  const inputs = (
    <div className="space-y-5">
      <Field
        label="Currency"
        htmlFor="loan-currency"
        hint="Detected from your browser — change anytime."
      >
        <Select
          id="loan-currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as typeof currency)}
          data-testid="loan-currency-select"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </Select>
      </Field>
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
    const interestSharePct = (interest / total) * 100

    const extraNum = parseNum(extraPayment)
    const extraError =
      extraNum !== null && extraNum < 0
        ? "The extra payment can't be negative."
        : null

    let savings: { monthsSaved: number; interestSaved: number } | null = null
    if (!extraError && extraNum !== null && extraNum > 0) {
      const sim = simulateExtraPayment(p, r, monthly, extraNum)
      if (sim) {
        savings = {
          monthsSaved: Math.max(0, n - sim.payoffMonths),
          interestSaved: Math.max(0, interest - sim.totalInterestPaid),
        }
      }
    }

    return (
      <div>
        <ResultCallout
          label="Monthly payment"
          value={money(monthly, currency)}
          sublabel={`over ${term} ${term === 1 ? "year" : "years"} (${n} payments)`}
        />
        <ResultList>
          <ResultStat label="Principal" value={money(p, currency)} />
          <ResultStat label="Total interest" value={money(interest, currency)} />
          <ResultStat label="Total payment" value={money(total, currency)} />
        </ResultList>

        <SmartInsight>
          Interest is approximately {interestSharePct.toFixed(1)}% of your total
          payments.
        </SmartInsight>

        <SmartInsight>
          <p className="font-semibold text-foreground">
            See how much you could save
          </p>
          <div className="mt-3 max-w-xs">
            <Field
              label="Extra monthly payment"
              htmlFor="loan-extra"
              hint="Optional — paid on top of your regular monthly payment."
            >
              <TextInput
                id="loan-extra"
                type="number"
                inputMode="decimal"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                placeholder="0"
                data-testid="loan-input-extra"
              />
            </Field>
          </div>

          {extraError && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {extraError}
            </p>
          )}

          {!extraError && !savings && (
            <p className="mt-3 text-sm text-muted-foreground">
              Enter an extra monthly payment above to see how much time and
              interest you could save.
            </p>
          )}

          {!extraError && savings && (
            <div
              key={`${savings.monthsSaved}-${Math.round(savings.interestSaved)}`}
              className="mt-3 animate-in fade-in space-y-1 duration-300"
            >
              <p className="text-sm text-foreground">
                Pay an extra {money(extraNum ?? 0, currency)} every month, and
                you could pay off this loan{" "}
                <span className="font-semibold">
                  {savings.monthsSaved}{" "}
                  {savings.monthsSaved === 1 ? "month" : "months"} sooner
                </span>
                .
              </p>
              <p className="text-sm text-foreground">
                Interest saved:{" "}
                <span className="font-semibold">
                  {money(savings.interestSaved, currency)}
                </span>
              </p>
            </div>
          )}
        </SmartInsight>
      </div>
    )
  }
}
