import { verifyToken } from '../utils/token.js'

export async function validateToken(req, res, next) {
  const { token } = req.cookies
  if (!token) return res.status(401).json({ message: 'Access Denied. Token not provied.' })

  req.user = null
  try {
    const payload = await verifyToken(token)
    req.user = payload
  } catch (err) {
    req.user = null
    res.status(403).json({ message: 'Token not valid' })
  }
  next()

}
