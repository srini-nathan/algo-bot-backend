import { Users } from "../db/users"
import { User } from "../types/user"

export const getUsers = (): Promise<User[]> => Users.find()
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await Users.findOne({ email }).select(
    "+authentication.salt +authentication.password"
  )
  return user
}

export const getUserBySessionToken = (
  sessionToken: string
): Promise<User | null> =>
  Users.findOne({ "authentication.sessionToken": sessionToken })

export const getUserById = (id: string): Promise<User | null> =>
  Users.findById(id)

export const createUser = async (values: Partial<User>): Promise<User> => {
  const { _id, ...rest } = values
  const userCount = await Users.countDocuments({})
  const user = new Users({ _id: String(userCount + 1), ...rest })
  return user.save().then((user) => user.toObject())
}

export const deleteUserById = (id: string): Promise<void> =>
  Users.findByIdAndDelete(id)

export const updateUserById = (
  id: string,
  values: Partial<User>
): Promise<User | null> => Users.findByIdAndUpdate(id, values, { new: true })
