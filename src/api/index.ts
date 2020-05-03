import { Router } from 'express'
import { externalController } from './external'
import { internalController } from './internal'

const apiController = Router()

apiController.use('/internal', internalController)
apiController.use('/external', externalController)
apiController.get('/status', (req, res) => {
  res.sendStatus(200)
})

export { apiController }
