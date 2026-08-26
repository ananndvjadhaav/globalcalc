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

type Units = "metric" | "imperial"

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal weight"
  if (bmi < 30) return "Overweight"
  return "Obese"
}

export function BmiCalculator() {
  const [units, setUnits] = useState<Units>("metric")
  // Metric
  const [kg, setKg] = useState("")
  const [cm, setCm] = useState("")
  // Imperial
  const [lb, setLb] = useState("")
  const [ft, setFt] = useState("")
  const [inch, setInch] = useState("")

  const inputs = (
    <div className="space-y-5">
      <Segmented<Units>
        ariaLabel="Measurement units"
        value={units}
        onChange={setUnits}
        options={[
          { value: "metric", label: "Metric (kg, cm)" },
          { value: "imperial", label: "Imperial (lb, ft/in)" },
        ]}
      />

      {units === "metric" ? (
        <>
          <Field label="Weight (kg)" htmlFor="bmi-kg">
            <TextInput
              id="bmi-kg"
              type="number"
              inputMode="decimal"
              value={kg}
              onChange={(e) => setKg(e.target.value)}
              placeholder="70"
              data-testid="bmi-input-kg"
            />
          </Field>
          <Field label="Height (cm)" htmlFor="bmi-cm">
            <TextInput
              id="bmi-cm"
              type="number"
              inputMode="decimal"
              value={cm}
              onChange={(e) => setCm(e.target.value)}
              placeholder="175"
              data-testid="bmi-input-cm"
            />
          </Field>
        </>
      ) : (
        <>
          <Field label="Weight (lb)" htmlFor="bmi-lb">
            <TextInput
              id="bmi-lb"
              type="number"
              inputMode="decimal"
              value={lb}
              onChange={(e) => setLb(e.target.value)}
              placeholder="154"
              data-testid="bmi-input-lb"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Height (ft)" htmlFor="bmi-ft">
              <TextInput
                id="bmi-ft"
                type="number"
                inputMode="numeric"
                value={ft}
                onChange={(e) => setFt(e.target.value)}
                placeholder="5"
                data-testid="bmi-input-ft"
              />
            </Field>
            <Field label="Height (in)" htmlFor="bmi-in">
              <TextInput
                id="bmi-in"
                type="number"
                inputMode="decimal"
                value={inch}
                onChange={(e) => setInch(e.target.value)}
                placeholder="9"
                data-testid="bmi-input-in"
              />
            </Field>
          </div>
        </>
      )}
    </div>
  )

  return <CalculatorInterface inputs={inputs} result={renderResult()} />

  function renderResult() {
    let bmi: number | null = null

    if (units === "metric") {
      const w = parseNum(kg)
      const h = parseNum(cm)
      if (w === null || h === null) {
        return (
          <EmptyResult>
            Enter your weight and height to calculate your BMI.
          </EmptyResult>
        )
      }
      if (w <= 0 || h <= 0) {
        return <ErrorNote>Weight and height must be greater than zero.</ErrorNote>
      }
      const m = h / 100
      bmi = w / (m * m)
    } else {
      const w = parseNum(lb)
      const f = parseNum(ft) ?? 0
      const i = parseNum(inch) ?? 0
      if (w === null || (ft.trim() === "" && inch.trim() === "")) {
        return (
          <EmptyResult>
            Enter your weight and height to calculate your BMI.
          </EmptyResult>
        )
      }
      const totalIn = f * 12 + i
      if (w <= 0 || totalIn <= 0) {
        return <ErrorNote>Weight and height must be greater than zero.</ErrorNote>
      }
      bmi = (703 * w) / (totalIn * totalIn)
    }

    return (
      <div>
        <ResultCallout
          label="Body Mass Index"
          value={fmt(bmi, 1)}
          sublabel={bmiCategory(bmi)}
        />
        <ResultList>
          <ResultStat label="Category" value={bmiCategory(bmi)} />
          <ResultStat label="Normal range" value="18.5 – 24.9" />
        </ResultList>
      </div>
    )
  }
}
