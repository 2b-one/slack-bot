import bodyParser from 'body-parser'
import { Router } from 'express'
import { jenkinsController } from './jenkinsController'

const internalController = Router()

internalController.use(bodyParser.json())
internalController.use(jenkinsController)

export { internalController }
