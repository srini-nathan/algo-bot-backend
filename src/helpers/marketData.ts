import { DateTime } from "luxon"

export type Market = "EQUITY" | "OPTION" | "FUTURE" | "BOND" | "FOREX"

export const marketOpen = "09:00:00" // In UTC
export const marketClose = "16:30:00" // In UTC

// Define the TimeZone enum
export enum TimeZone {
  AsiaKolkata = "Asia/Kolkata",
  EuropeLondon = "Europe/London",
}

export const marketHrs = async (
  market: Market,
  date: Date,
  timeZone: string
) => {
  if (market !== "EQUITY" && market !== "OPTION") {
    throw new Error("Market hours only support market hrs for: EQUITY, OPTION")
  }

  const luxonDate = DateTime.fromJSDate(date, { zone: timeZone })

  // Check weekend
  if (luxonDate.weekday === 6 || luxonDate.weekday === 7) {
    return { isOpen: false }
  }

  const marketTime = luxonDate.toFormat("HH:mm:ss")
  const isMarketOpen = marketTime >= marketOpen && marketTime < marketClose

  const startDate = luxonDate.set({ hour: 7, minute: 0, second: 0 })
  const endDate = luxonDate.set({ hour: 14, minute: 30, second: 0 })

  return {
    start: startDate.toJSDate(),
    end: endDate.toJSDate(),
    isOpen: isMarketOpen,
  }
}

export const currentlyOpen = async (market: Market, timeZone: string) => {
  const today = DateTime.now().setZone(timeZone)
  const marketHours = await marketHrs(market, today.toJSDate(), timeZone)

  return (
    today >= DateTime.fromJSDate(marketHours.start, { zone: timeZone }) &&
    today < DateTime.fromJSDate(marketHours.end, { zone: timeZone })
  )
}

export const endOfWeek = async (date: Date, timeZone: string) => {
  const currentDayOfWeek = DateTime.fromJSDate(date, { zone: timeZone }).weekday

  if (currentDayOfWeek === 4) {
    const tomorrowDate = DateTime.fromJSDate(date, { zone: timeZone }).plus({
      days: 1,
    })
    const tomorrowMarketHours = await marketHrs(
      "OPTION",
      tomorrowDate.toJSDate(),
      timeZone
    )

    if (!tomorrowMarketHours.isOpen) {
      return true
    }
  }

  const marketHours = await marketHrs("OPTION", date, timeZone)

  return currentDayOfWeek === 5 && marketHours.isOpen
}
