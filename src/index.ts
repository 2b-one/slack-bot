import 'reflect-metadata'
import { Server } from './Server'
import { BuildTrackService } from './services/BuildTrackService'
import { ConfigService } from './services/ConfigService'
import { DeployTrackService } from './services/DeployTrackService'
import { FlowService } from './services/FlowService'
import { ProjectService } from './services/ProjectService'
import { serviceContainer } from './services/ServiceContainer'
import { logger } from './utils/logger'

async function start() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require('../app.config')

    const configService = serviceContainer.register('configService', new ConfigService(config))
    const projectService = serviceContainer.register('projectService', new ProjectService())

    await projectService.initialize()

    serviceContainer.register('buildTrackService', new BuildTrackService())
    serviceContainer.register('deployTrackService', new DeployTrackService())
    serviceContainer.register('flowService', new FlowService())

    const server = new Server(configService.data.server.port)
    server.start()
  } catch (e) {
    logger.error('bootstrap.config', { error: e.message })
  }
}

start()
