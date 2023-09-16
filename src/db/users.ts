import mongoose, { Model, Schema } from "mongoose"

import { User } from "../types/user"

const userSchema: Schema<User> = new mongoose.Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
})

export const Users: Model<User> = mongoose.model<User>("User", userSchema)

export default Users
