import { PrismaClient } from '@prisma/client'
import z from 'zod'

const prisma = new PrismaClient()

const authSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4),
  password: z.string().min(7).max(20),
  role: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine(
      async (role) => {
        const roleFound = await prisma.$queryRaw`SELECT enumlabel 
        FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = 'Role' and enumlabel = ${role}`

        return roleFound.length
      },
      {
        message: 'The roles entered do not exist',
        path: ['role']
      }
    )
})

export const registerSchema = authSchema.partial({ role: true })

export const loginSchema = authSchema.pick({
  email: true,
  password: true
})

export const sendEmailSchema = authSchema.pick({
  email: true
})

export const recoverPasswordSchema = authSchema.pick({
  password: true
})
