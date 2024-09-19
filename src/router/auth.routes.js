import { Router } from 'express'
import {
  login,
  register,
  logout,
  recoverPassword,
  sendEmailRecoverPassword
} from '../controllers/auth.controller.js'
import { validateSchema } from '../middlewares/validate-schema.js'
import {
  loginSchema,
  recoverPasswordSchema,
  registerSchema,
  sendEmailSchema
} from '../schemas/auth.schema.js'

const router = Router()

router.post('/login', validateSchema(loginSchema), login)
router.post('/register', validateSchema(registerSchema), register)
router.post('/logout', logout)
router.post(
  '/email-recover-password',
  validateSchema(sendEmailSchema),
  sendEmailRecoverPassword
)
router.put(
  '/recover-password',
  validateSchema(recoverPasswordSchema),
  recoverPassword
)

export default router
