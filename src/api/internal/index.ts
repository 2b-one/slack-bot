import bodyParser from 'body-parser'
import { Router } from 'express'
import { bitbucketController } from './bitbucketController'
import { jenkinsController } from './jenkinsController'

const internalController = Router()

internalController.use(bodyParser.json())
internalController.use(bitbucketController)
internalController.use(jenkinsController)

export { internalController }
