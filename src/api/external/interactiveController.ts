/* eslint-disable @typescript-eslint/camelcase */
import { Router } from 'express'
import { FlowService } from '../../services/FlowService'
import { serviceContainer } from '../../services/ServiceContainer'
import { InteractivePayload } from '../../types/SlackAPI'
import { logger } from '../../utils/logger'

const interactiveController = Router()

interactiveController.post('/interactive', (req, res) => {
  let payload: InteractivePayload
  try {
    payload = JSON.parse(req.body.payload)
  } catch (e) {
    logger.error('slack.interactive.badPayload', { error: e.message, payload: req.body.payload })
    return res.sendStatus(400)
  }

  switch (payload.type) {
    case 'block_actions': {
      const flowService = serviceContainer.get(FlowService)
      flowService.continue(payload)
      return res.sendStatus(200)
    }

    default: {
      logger.warn('slack.interactive.unknownPayloadType', { payload: req.body.payload })
      return res.sendStatus(200)
    }
  }
})

export { interactiveController }
