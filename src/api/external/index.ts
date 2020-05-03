import bodyParser from 'body-parser'
import { Router } from 'express'
import { clientVerification } from './clientVerification'
import { commandsController } from './commandsController'
import { interactiveController } from './interactiveController'

const externalController = Router()

externalController.use(
  bodyParser.urlencoded({
    verify: (req, res, buf, encoding) => {
      if (buf?.length) {
        ;(req as any).rawBody = buf.toString(encoding ?? 'utf8')
      }
    },
    extended: true,
  }),
)
externalController.use(clientVerification)
externalController.use(commandsController)
externalController.use(interactiveController)

export { externalController }
