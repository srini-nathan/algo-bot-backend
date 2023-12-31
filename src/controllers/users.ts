import { Request, Response } from "express"

import {
  deleteUserById,
  getUserById,
  getUserBySessionToken,
  getUsers,
  updateUserById,
} from "../collections/userCollection"
import { foRes } from "../helpers"

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers()

    return res.status(200).json(foRes(200, "Users found", users))
  } catch (error) {
    console.log(error)
    return res.status(500).json(foRes(500, `Something went wrong, ${error}`))
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await getUserById(id)

    if (!user) {
      return res.status(404).json(foRes(404, "User not found"))
    }

    return res.status(200).json(foRes(200, "User found", user))
  } catch (error) {
    console.log(error)
    return res.status(500).json(foRes(500, `Something went wrong, ${error}`))
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { username } = req.body

    if (!username) {
      return res.status(400).json(foRes(400, "Missing required fields"))
    }

    const user = await getUserById(id)

    if (!user) {
      return res.status(404).json(foRes(404, "User not found"))
    }

    user.username = username
    await user.save()

    return res.status(200).json(foRes(200, "User updated successfully", user))
  } catch (error) {
    console.log(error)
    return res.status(500).json(foRes(500, `Something went wrong, ${error}`))
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await getUserById(id)

    if (!user) {
      return res.status(404).json(foRes(404, "User not found"))
    }

    const deletedUser = await deleteUserById(id)

    return res
      .status(200)
      .json(foRes(200, "User deleted successfully", deletedUser))
  } catch (error) {
    console.log(error)
    return res.status(500).json(foRes(500, `Something went wrong, ${error}`))
  }
}

export const meUser = async (req: Request, res: Response) => {
  try {
    const sessionToken = req.cookies["API_AUTH"]

    if (!sessionToken)
      return res.sendStatus(404).json(foRes(404, "Invalid User"))

    const meUser = await getUserBySessionToken(sessionToken)
    if (!meUser) res.sendStatus(404).json(foRes(404, "User not found"))

    return res.status(200).json(foRes(200, "meUser Details", meUser))
  } catch (error) {
    console.log(error)
    return res.status(500).json(foRes(500, `Something went wrong, ${error}`))
  }
}
