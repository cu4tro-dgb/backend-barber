import { Router } from 'express'
import { findUsers } from '../controllers/user.controller.js'

const router = Router()

router.get('/users', findUsers)

export default router
