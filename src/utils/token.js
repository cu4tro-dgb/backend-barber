import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config.js'

export async function generateToken(payload) {
  try {
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
    return token
  } catch (error) {
    console.error(error)
    throw new Error('Error in generated token')
  }
}

export async function verifyToken(token) {
  try {
    const payload = jwt.verify(token, SECRET_KEY)
    return payload
  } catch (error) {
    console.error(error)
    throw new Error('Error verifying your token')
  }
}
