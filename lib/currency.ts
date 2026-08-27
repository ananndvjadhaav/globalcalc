import { useEffect, useState } from "react"

/**
 * Small, self-contained currency utility for the monetary calculators
 * (Discount, Loan). Detection is based purely on the browser's own
 * locale/region — no IP lookups, no external APIs, no third-party
 * geolocation packages. Currency affects DISPLAY ONLY; it never changes
 * any calculator's math.
 */

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "INR"
  | "JPY"
  | "CAD"
  | "AUD"
  | "CNY"
  | "CHF"
  | "HKD"
  | "SGD"
  | "AED"
  | "SAR"
  | "NZD"
  | "ZAR"
  | "BRL"
  | "MXN"
  | "KRW"

export interface CurrencyOption {
  code: CurrencyCode
  name: string
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "INR", name: "Indian Rupee" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "ZAR", name: "South African Rand" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "KRW", name: "South Korean Won" },
]

const DEFAULT_CURRENCY: CurrencyCode = "USD"

/** ISO 3166-1 region code → ISO 4217 currency code, for the currencies we support. */
const REGION_TO_CURRENCY: Record<string, CurrencyCode> = {
  US: "USD",
  GB: "GBP",
  IN: "INR",
  JP: "JPY",
  CA: "CAD",
  AU: "AUD",
  CN: "CNY",
  CH: "CHF",
  HK: "HKD",
  SG: "SGD",
  AE: "AED",
  SA: "SAR",
  NZ: "NZD",
  ZA: "ZAR",
  BR: "BRL",
  MX: "MXN",
  KR: "KRW",
  // Eurozone
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  IE: "EUR",
  PT: "EUR",
  FI: "EUR",
  GR: "EUR",
  LU: "EUR",
  SK: "EUR",
  SI: "EUR",
  LT: "EUR",
  LV: "EUR",
  EE: "EUR",
  CY: "EUR",
  MT: "EUR",
  HR: "EUR",
}

export function isCurrencyCode(v: string | null | undefined): v is CurrencyCode {
  return !!v && CURRENCIES.some((c) => c.code === v)
}

function extractRegion(locale: string): string | null {
  const segments = locale.split("-")
  for (const seg of segments.slice(1)) {
    if (/^[A-Za-z]{2}$/.test(seg)) return seg.toUpperCase()
  }
  try {
    // Fills in a default region for bare language tags like "en" or "hi".
    const maximized = new Intl.Locale(locale).maximize()
    return maximized.region ?? null
  } catch {
    return null
  }
}

/** Detect the user's likely currency from the browser's own locale — no geolocation. */
export function detectCurrency(): CurrencyCode {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return DEFAULT_CURRENCY
  }
  try {
    const locale =
      navigator.language || Intl.NumberFormat().resolvedOptions().locale || "en-US"
    const region = extractRegion(locale)
    if (region && REGION_TO_CURRENCY[region]) {
      return REGION_TO_CURRENCY[region]
    }
  } catch {
    // Locale unparsable in this environment — fall back safely below.
  }
  return DEFAULT_CURRENCY
}

const STORAGE_KEY = "globalcalc:currency"

function getStoredCurrency(): CurrencyCode | null {
  if (typeof window === "undefined") return null
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return isCurrencyCode(v) ? v : null
  } catch {
    return null
  }
}

function setStoredCurrency(code: CurrencyCode): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // localStorage unavailable (e.g. private browsing) — selection just won't persist.
  }
}

/** Saved preference, else browser-locale detection, else USD. */
function getInitialCurrency(): CurrencyCode {
  return getStoredCurrency() ?? detectCurrency()
}

/**
 * Client-only hook for the two monetary calculators (Discount, Loan).
 * Starts at USD on the server (safe, avoids hydration mismatches) and
 * resolves to the saved/detected currency once mounted in the browser.
 */
export function useCurrency(): [CurrencyCode, (code: CurrencyCode) => void] {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY)

  useEffect(() => {
    setCurrencyState(getInitialCurrency())
  }, [])

  function setCurrency(code: CurrencyCode) {
    setCurrencyState(code)
    setStoredCurrency(code)
  }

  return [currency, setCurrency]
}
