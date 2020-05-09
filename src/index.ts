import 'reflect-metadata'
import { Server } from './Server'
import { ConfigService } from './services/ConfigService'
import { ProjectService } from './services/ProjectService'
import { serviceContainer } from './services/ServiceContainer'
import { logger } from './utils/logger'

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require('../app.config')
  const configService = new ConfigService(config)
  serviceContainer.register('configService', configService)
  serviceContainer.register('projectService', new ProjectService())

  const server = new Server(configService.data.server.port)
  server.start()
} catch (e) {
  logger.error('bootstrap.config', { error: e })
}
