import { NextFunction, Request, Response } from "express"
import { get, merge } from "lodash"

import { getUserBySessionToken } from "../collections/userCollection"
import { foRes } from "../helpers"

// export const isSuperUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     try {
//         const {id} = req.params
//         const currentUserId = get(req, 'identity.id') as string

//         if(!currentUserId) return res.sendStatus(403)

//         if (currentUserId.toString() !== id) return res.sendStatus(404)

//         return next()
//     } catch (error) {
//         console.log(error);
//         res.sendStatus(400)
//     }
// }

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies["API_AUTH"]

    if (!sessionToken) {
      return res.status(403).json(foRes(403, "Unauthorized"))
    }

    const user = await getUserBySessionToken(sessionToken)

    if (!user) {
      return res.status(403).json(foRes(403, "Unauthorized"))
    }

    merge(req, { identity: { user } })

    return next()
  } catch (error) {
    console.log(error)
    return res.status(500).json(foRes(500, `Something went wrong, ${error}`))
  }
}
