/* eslint-disable @typescript-eslint/camelcase */
import { Router } from 'express'
import { FlowService } from '../../services/FlowService'
import { serviceContainer } from '../../services/ServiceContainer'
import { InteractivePayload } from '../../types/SlackAPI'
import { createSafeOptions } from '../../utils/createSafeOption'
import { logger } from '../../utils/logger'

const interactiveController = Router()

interactiveController.post('/interactive', async (req, res) => {
  let payload: InteractivePayload
  try {
    payload = JSON.parse(req.body.payload)
  } catch (e) {
    logger.error('slack.interactive.badPayload', { error: e.message, payload: req.body.payload })
    return res.sendStatus(400)
  }

  const flowService = serviceContainer.get(FlowService)
  switch (payload.type) {
    case 'block_actions': {
      flowService.continue(payload)
      return res.sendStatus(200)
    }

    case 'view_submission': {
      const result = await flowService.submit(payload)
      return result
        ? // it's important to send empty body, otherwise slack will reject it
          res.status(200).send()
        : res.sendStatus(500)
    }

    case 'block_suggestion': {
      return res.status(200).json({
        options: createSafeOptions(flowService.suggest(payload)),
      })
    }

    default: {
      logger.warn('slack.interactive.unknownPayloadType', { payload: req.body.payload })
      return res.sendStatus(200)
    }
  }
})

export { interactiveController }
