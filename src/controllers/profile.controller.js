import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUserProfile(req, res) {
  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        id: req.user.id,
        status: 'ACTIVE'
      },
      select: {
        email: true,
        role: true,
        username: true,
        Profile: {
          select: {
            firstname: true,
            lastname: true,
            bio: true
          }
        }
      }
    })

    if (!userProfile) return res.status(404).json('User not found')
    
    res.status(200).json(userProfile)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
