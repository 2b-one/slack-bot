import bodyParser from 'body-parser'
import { Router } from 'express'
import { IncomingMessage, ServerResponse } from 'http'
import { clientVerification } from './clientVerification'
import { commandsController } from './commandsController'
import { interactiveController } from './interactiveController'
import { eventsController } from './eventsController'

const externalController = Router()

function saveRawBody(req: IncomingMessage, res: ServerResponse, buf: Buffer, encoding: string) {
  if (buf?.length) {
    ;(req as any).rawBody = buf.toString(encoding ?? 'utf8')
  }
}

externalController.use(bodyParser.urlencoded({ verify: saveRawBody, extended: true }))
externalController.use(bodyParser.json({ verify: saveRawBody }))
externalController.use(clientVerification)
externalController.use(commandsController)
externalController.use(eventsController)
externalController.use(interactiveController)

export { externalController }
