import { Router } from "express"

import { scheduleEngine } from "../controllers/strategy"

export default (router: Router) => {
  router.post("/bot/engine/:broker", scheduleEngine)
}
