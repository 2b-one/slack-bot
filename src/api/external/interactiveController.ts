import { Router } from 'express'

const interactiveController = Router()

interactiveController.post('/interactive', (req, res) => {
  res.sendStatus(200)
})

export { interactiveController }
