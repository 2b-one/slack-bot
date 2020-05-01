import { Router } from 'express'
import { clientVerification } from './clientVerification'
import { jenkinsController } from './jenkinsController'
import { slackController } from './slackController'

const apiController = Router()

apiController.use(clientVerification)
apiController.use(slackController)
apiController.use(jenkinsController)
apiController.get('/status', (req, res) => {
  res.sendStatus(200)
})

export { apiController }
