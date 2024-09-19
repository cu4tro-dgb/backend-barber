import bcrypt from 'bcrypt'

export async function hashPassword(password) {
  const SALT_ROUNDS = 10
  try {
    return await bcrypt.hash(password, SALT_ROUNDS)
  } catch (error) {
    console.error(error)
    throw new Error('Error hashing password')
  }
}

export async function comparePassword(password, hashPassword) {
  try {
    return await bcrypt.compare(password, hashPassword)
  } catch (error) {
    console.error(error)
    return false
  }
}
