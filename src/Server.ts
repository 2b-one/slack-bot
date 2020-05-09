import express from 'express'
import { apiController } from './api'
import { logger } from './utils/logger'

export class Server {
  constructor(public readonly port: number) {}

  start() {
    const app = express()

    app.use('/api', apiController)

    app.listen(this.port, () => {
      logger.info('server.start')
    })
  }
}
