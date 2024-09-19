import { Router } from 'express'
import { getUserProfile } from '../controllers/profile.controller.js'

const router = Router()

router.get('/user-profile', getUserProfile)

export default router
