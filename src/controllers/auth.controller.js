import { PrismaClient } from '@prisma/client'
import { comparePassword, hashPassword } from '../utils/password.js'
import { generateToken, verifyToken } from '../utils/token.js'
import { Resend } from 'resend'
import { RESEND_API_KEY } from '../config.js'

const prisma = new PrismaClient()
const resend = new Resend(RESEND_API_KEY)

const URLFrontend = 'http://localhost:8000/'

export async function login(req, res) {
  const { email, password } = req.body
  try {
    const foundUser = await prisma.user.findUnique({ where: { email } })
    if (!foundUser) return res.status(404).json({ message: 'User not found' })

    const currentUserActive = await prisma.user.findFirst({
      where: { status: 'ACTIVE' }
    })
    if (!currentUserActive)
      return res.status(404).json({ message: 'Please activate your account' })

    const match = await comparePassword(password, currentUserActive.password)
    if (!match)
      return res.status(401).json({ message: 'incorrect credentials' })

    const token = await generateToken({ id: currentUserActive.id })

    await prisma.user.update({
      data: {
        lastLogin: new Date()
      },
      where: {
        email
      }
    })

    res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
      })
      .json({ token })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function register(req, res) {
  const { email, password, username, role } = req.body
  try {
    const userFound = await prisma.user.findFirst({ where: { email } })
    if (userFound)
      return res.status(400).json({ message: 'The user is already registered' })

    const passwordHash = await hashPassword(password)

    const createUser = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        username,
        role
      }
    })

    const { password: _, ...user } = createUser
    res.status(201).json(user)
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function logout(req, res) {
  res.clearCookie('token').json({ message: 'Logged out successfully' })
}

export async function sendEmailRecoverPassword(req, res) {
  const { email } = req.body
  try {
    const userFound = await prisma.user.findFirst({ where: { email } })
    if (!userFound) return res.status(404).json({ message: 'User not found' })

    const token = await generateToken({ email: userFound.email })

    const { data, error } = await resend.emails.send({
      from: 'Barbershop <onboarding@resend.dev>',
      to: [`${userFound.email}`],
      subject: 'Recover Password',
      html: `<p>Hello ${
        userFound.username || 'user'
      }, we sent you the link so you can update your password.</p>
       <a href="${URLFrontend}recover-password?token=${token}">Change password</a>`
    })

    if (error) {
      return res.status(400).json({ error })
    }

    res.status(200).json({ message: 'Check your email inbox' })
  } catch (error) {
    console.error('Error during recover password:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function recoverPassword(req, res) {
  const { token } = req.query
  const { password } = req.body
  try {
    const payload = await verifyToken(token)
    if (!payload)
      return res.status(403).json({ message: 'Token expired or incorrect' })

    const passwordHash = await hashPassword(password)

    await prisma.user.update({
      data: {
        password: passwordHash,
        status: 'ACTIVE'
      },
      where: {
        email: payload.email
      }
    })

    res.status(200).json({ message: 'Password updated' })
  } catch (error) {
    console.error('Error during recover password:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
