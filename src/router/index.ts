import express from "express"

import authentication from "./authentication"
import strategy from "./strategy"
import users from "./users"

const router = express.Router()

export default (): express.Router => {
  authentication(router)
  users(router)
  strategy(router)

  return router
}
