import { Request, Response } from "express"

import { StrategyEngine } from "../bot/strategyEngine"
import { foRes } from "../helpers"
import { currentlyOpen, endOfWeek, TimeZone } from "../helpers/marketData"

export const scheduleEngine = async (req: Request, res: Response) => {
  const engine = new StrategyEngine()

  try {
    const { startEvent, endEvent, market, timeZone } = req.body

    // Check if the provided timeZone is valid
    if (!(timeZone in TimeZone)) {
      return res.status(400).json(foRes(400, "Invalid time zone"))
    }

    // Schedule start and stop at a specific date and time
    const startDateTime = new Date(startEvent)
    const stopDateTime = new Date(endEvent)

    // Check if the market is open
    const isMarketOpen = await currentlyOpen(market, timeZone)

    // Check if it's the end of the week
    const isEndOfWeek = await endOfWeek(startDateTime, timeZone)

    if (isMarketOpen && !isEndOfWeek) {
      engine.scheduleStartStop(startDateTime, stopDateTime)
      return res.status(201).json(foRes(201, "Event scheduled"))
    } else {
      return res
        .status(400)
        .json(foRes(400, "Market is not open or it's the end of the week"))
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json(foRes(500, `Something went wrong, ${error}`))
  }
}
