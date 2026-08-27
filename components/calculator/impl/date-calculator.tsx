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
  ResultList,
  ResultStat,
  parseNum,
  fmt,
} from "./fields"
import { SmartInsight } from "./insight"

type Mode = "difference" | "addSubtract"
type Op = "add" | "subtract"

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`
}

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

function ymdDiff(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()
  if (days < 0) {
    months -= 1
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  return { years, months, days }
}

function formatLong(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function DateCalculator() {
  const [mode, setMode] = useState<Mode>("difference")
  // Difference mode
  const [start, setStart] = useState<string>(() => todayStr())
  const [end, setEnd] = useState("")
  // Add / subtract mode
  const [base, setBase] = useState<string>(() => todayStr())
  const [op, setOp] = useState<Op>("add")
  const [days, setDays] = useState("")

  const inputs = (
    <div className="space-y-5">
      <Segmented<Mode>
        ariaLabel="Date calculation type"
        value={mode}
        onChange={setMode}
        options={[
          { value: "difference", label: "Difference" },
          { value: "addSubtract", label: "Add / subtract days" },
        ]}
      />

      {mode === "difference" ? (
        <>
          <Field label="Start date" htmlFor="date-start">
            <TextInput
              id="date-start"
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              data-testid="date-input-start"
            />
          </Field>
          <Field label="End date" htmlFor="date-end">
            <TextInput
              id="date-end"
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              data-testid="date-input-end"
            />
          </Field>
        </>
      ) : (
        <>
          <Field label="Start date" htmlFor="date-base">
            <TextInput
              id="date-base"
              type="date"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              data-testid="date-input-base"
            />
          </Field>
          <Segmented<Op>
            ariaLabel="Add or subtract"
            value={op}
            onChange={setOp}
            options={[
              { value: "add", label: "Add days" },
              { value: "subtract", label: "Subtract days" },
            ]}
          />
          <Field label="Number of days" htmlFor="date-days">
            <TextInput
              id="date-days"
              type="number"
              inputMode="numeric"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="30"
              data-testid="date-input-days"
            />
          </Field>
        </>
      )}
    </div>
  )

  return <CalculatorInterface inputs={inputs} result={renderResult()} />

  function renderResult() {
    if (mode === "difference") {
      if (!start || !end) {
        return <EmptyResult>Pick a start and end date to see the difference.</EmptyResult>
      }
      const s = parseDate(start)
      const e = parseDate(end)
      if (!s || !e) {
        return <ErrorNote>Please enter two valid dates.</ErrorNote>
      }

      const totalDays = Math.round((e.getTime() - s.getTime()) / 86_400_000)
      const abs = Math.abs(totalDays)
      const earlier = totalDays >= 0 ? s : e
      const later = totalDays >= 0 ? e : s
      const { years, months, days: dd } = ymdDiff(earlier, later)
      const weeksPart = Math.floor(abs / 7)
      const daysRemainder = abs % 7

      return (
        <div>
          <ResultCallout
            label="Difference"
            value={`${fmt(abs, 0)} ${abs === 1 ? "day" : "days"}`}
            sublabel={
              totalDays === 0
                ? "The two dates are the same."
                : `${years}y ${months}m ${dd}d`
            }
          />
          <ResultList>
            <ResultStat label="Total days" value={fmt(abs, 0)} />
            <ResultStat label="Total weeks" value={fmt(weeksPart, 0)} />
            <ResultStat
              label="Years, months, days"
              value={`${years}y ${months}m ${dd}d`}
            />
          </ResultList>
          {totalDays !== 0 && (
            <SmartInsight>
              That&apos;s {fmt(weeksPart, 0)} {weeksPart === 1 ? "week" : "weeks"}
              {daysRemainder > 0
                ? ` and ${fmt(daysRemainder, 0)} ${daysRemainder === 1 ? "day" : "days"}`
                : ""}
              .
            </SmartInsight>
          )}
        </div>
      )
    }

    // Add / subtract mode
    if (!base) {
      return <EmptyResult>Pick a start date and a number of days.</EmptyResult>
    }
    const b = parseDate(base)
    if (!b) {
      return <ErrorNote>Please enter a valid start date.</ErrorNote>
    }
    const n = parseNum(days)
    if (n === null) {
      return <EmptyResult>Enter the number of days to add or subtract.</EmptyResult>
    }
    if (n < 0) {
      return (
        <ErrorNote>
          Enter a positive number of days and use the Add/Subtract toggle.
        </ErrorNote>
      )
    }

    const delta = op === "add" ? Math.round(n) : -Math.round(n)
    const result = new Date(b.getFullYear(), b.getMonth(), b.getDate() + delta)

    return (
      <div>
        <ResultCallout
          label="Resulting date"
          value={result.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          sublabel={formatLong(result)}
        />
        <ResultList>
          <ResultStat label="Start date" value={formatLong(b)} />
          <ResultStat
            label={op === "add" ? "Days added" : "Days subtracted"}
            value={fmt(Math.round(n), 0)}
          />
        </ResultList>
        <SmartInsight>
          The resulting date falls on a{" "}
          {result.toLocaleDateString(undefined, { weekday: "long" })}.
        </SmartInsight>
      </div>
    )
  }
}
