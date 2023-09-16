import express from "express"

import {
  deleteUser,
  getAllUsers,
  meUser,
  updateUser,
} from "../controllers/users"
import { isAuthenticated } from "../middlewares"

export default (router: express.Router) => {
  router.get("/", isAuthenticated, meUser)
  router.get("/users", isAuthenticated, getAllUsers)
  router.delete("/users/:id", isAuthenticated, deleteUser)
  router.patch("/users/:id", isAuthenticated, updateUser)
}
