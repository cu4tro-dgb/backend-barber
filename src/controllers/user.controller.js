import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function findUsers(req, res) {
  const { _page, _limit, _email } = req.query
  try {

    const skip = _page || 0
    const take = _limit || 10

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        lastLogin: true,
        role: true,
        username: true
      },
      skip: skip * take,
      take,
      where: {
        email: {
          contains: _email
        }
      }

    })

    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
