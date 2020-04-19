import { Router } from 'express'
import { clientVerification } from './clientVerification'
import { jenkins } from './jenkins'
import { slackCommand } from './slackCommand'

const apiController = Router()

apiController.use(clientVerification)
apiController.use(slackCommand)
apiController.use(jenkins)

export { apiController }
