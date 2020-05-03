import { config } from 'dotenv'
import express from 'express'
import { apiController } from './api'
import { logger } from './utils/logger'

config()

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
const app = express()

app.use('/api', apiController)

app.listen(port, () => {
  logger.info('server.start')
})
