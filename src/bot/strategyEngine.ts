import Debug from "debug"
import _ from "lodash"

const debug = Debug("strategy-engine")

export class StrategyEngine {
  private isRunning: boolean = false
  private stopDelay: number = 0

  constructor() {}

  async start() {
    debug("Bot engine starting...")
    this.isRunning = true
    // Add your start logic here

    console.log("Bot engine starting...", this.stopDelay)
  }

  async stop() {
    debug("Strategy engine stopping...")
    this.isRunning = false
    // Add your stop logic here

    console.log("Strategy engine stopping...", this.stopDelay)
  }

  // Manual start function
  manualStart() {
    if (!this.isRunning) {
      this.start()
    }
  }

  // Manual stop function
  manualStop() {
    if (this.isRunning) {
      this.stop()
    }
  }

  // Function to check if the trigger event is running
  isEventRunning() {
    return { status: this.isRunning, decay: this.stopDelay }
  }

  // Recursive function to schedule automatic start and stop
  scheduleStartStop(startTime: string | Date, stopTime: string | Date) {
    const currentDateTime = new Date()
    const startDateTime = new Date(startTime)
    const stopDateTime = new Date(stopTime)

    if (currentDateTime >= startDateTime && currentDateTime < stopDateTime) {
      // If the current time is within the specified range, start the engine
      this.manualStart()

      // Calculate the delay until the stop time
      const stopDelay = stopDateTime.getTime() - currentDateTime.getTime()

      // Schedule the stop function
      setTimeout(() => {
        this.manualStop()
      }, stopDelay)
    } else {
      // Calculate the delay until the next start time
      const delay = _.max([
        startDateTime.getTime() - currentDateTime.getTime(),
        0,
      ])

      // Schedule the start function
      setTimeout(() => {
        this.manualStart()

        // Calculate the delay until the stop time
        this.stopDelay = stopDateTime.getTime() - startDateTime.getTime()

        // Schedule the stop function
        setTimeout(() => {
          this.manualStop()
        }, this.stopDelay)
      }, delay)
    }
  }

  // Function to cancel the scheduled start and stop
  cancelSchedule() {
    // Implement the cancellation logic here if needed
  }
}
