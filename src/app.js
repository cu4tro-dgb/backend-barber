import express, { json, urlencoded } from 'express'
import morgan from 'morgan'
import cors from './middlewares/cors.js'

import { validateToken } from './middlewares/validate-token.js'

import authRouter from './router/auth.routes.js'
import userProfileRouter from './router/profile.routes.js'
import userRouter from './router/user.routes.js'

import cookieParser from 'cookie-parser'

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(cookieParser())
app.use(cors)
app.use(morgan('dev'))

app.use('/api', authRouter)
app.use('/api', validateToken, userProfileRouter)
app.use('/api', validateToken, userRouter)

export default app
