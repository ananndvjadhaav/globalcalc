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
  fmt,
} from "./fields"

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`
}

/** Parse a yyyy-mm-dd value into a local Date, validating the calendar day. */
function parseDate(s: string): Date | null {
  if (!s) return null
  const [y, m, d] = s.split("-").map(Number)
  if (!y || !m || !d) return null
  const dt = new Date(y, m - 1, d)
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return null
  }
  return dt
}

/** Exact calendar difference in whole years, months, and days. */
function ymdDiff(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()
  if (days < 0) {
    months -= 1
    // Days in the month immediately before the target month (handles leap years).
    const prevMonthDays = new Date(to.getFullYear(), to.getMonth(), 0).getDate()
    days += prevMonthDays
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  return { years, months, days }
}

export function AgeCalculator() {
  const [dob, setDob] = useState("")
  const [asOf, setAsOf] = useState<string>(() => todayStr())

  const birth = parseDate(dob)
  const target = parseDate(asOf)

  const inputs = (
    <div className="space-y-5">
      <Field label="Date of birth" htmlFor="age-dob">
        <TextInput
          id="age-dob"
          type="date"
          value={dob}
          max={asOf || todayStr()}
          onChange={(e) => setDob(e.target.value)}
          data-testid="age-input-dob"
        />
      </Field>
      <Field label="Age as of" htmlFor="age-asof" hint="Defaults to today.">
        <TextInput
          id="age-asof"
          type="date"
          value={asOf}
          onChange={(e) => setAsOf(e.target.value)}
          data-testid="age-input-asof"
        />
      </Field>
    </div>
  )

  return <CalculatorInterface inputs={inputs} result={renderResult()} />

  function renderResult() {
    if (!dob) {
      return <EmptyResult>Enter a date of birth to calculate the age.</EmptyResult>
    }
    if (!birth) {
      return <ErrorNote>Please enter a valid date of birth.</ErrorNote>
    }
    if (!target) {
      return <ErrorNote>Please enter a valid &quot;age as of&quot; date.</ErrorNote>
    }
    if (birth.getTime() > target.getTime()) {
      return (
        <ErrorNote>
          The date of birth is after the target date — please pick an earlier
          birth date.
        </ErrorNote>
      )
    }

    const { years, months, days } = ymdDiff(birth, target)
    const totalDays = Math.round(
      (target.getTime() - birth.getTime()) / 86_400_000,
    )
    const totalMonths = years * 12 + months
    const totalWeeks = Math.floor(totalDays / 7)

    return (
      <div>
        <ResultCallout
          label="Age"
          value={`${years} ${years === 1 ? "year" : "years"}`}
          sublabel={`${months} ${months === 1 ? "month" : "months"}, ${days} ${
            days === 1 ? "day" : "days"
          }`}
        />
        <ResultList>
          <ResultStat label="Total months" value={fmt(totalMonths, 0)} />
          <ResultStat label="Total weeks" value={fmt(totalWeeks, 0)} />
          <ResultStat label="Total days" value={fmt(totalDays, 0)} />
        </ResultList>
      </div>
    )
  }
}
