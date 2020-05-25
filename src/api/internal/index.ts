import bodyParser from 'body-parser'
import { Router } from 'express'
import { bitbucketHookController } from './bitbucketHookController'
import { jenkinsController } from './jenkinsController'

const internalController = Router()

internalController.use(bodyParser.json())
internalController.use(bitbucketHookController)
internalController.use(jenkinsController)

export { internalController }
