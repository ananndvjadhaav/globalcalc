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

export function DiscountCalculator() {
  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState("")

  const p = parseNum(price)
  const d = parseNum(discount)

  const inputs = (
    <div className="space-y-5">
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

    return (
      <div>
        <ResultCallout
          label="Final price"
          value={money(final)}
          sublabel={`You save ${money(saved)} (${d}%)`}
        />
        <ResultList>
          <ResultStat label="Original price" value={money(p)} />
          <ResultStat label="Discount amount" value={money(saved)} />
          <ResultStat label="Final price" value={money(final)} />
        </ResultList>
      </div>
    )
  }
}
