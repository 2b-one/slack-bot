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

  const flowService = serviceContainer.get(FlowService)
  switch (payload.type) {
    case 'block_actions': {
      flowService.continue(payload)
      return res.sendStatus(200)
    }

    case 'view_submission': {
      flowService.submit(payload)
      // it's important to send empty body, otherwise slack will reject it
      return res.status(200).send()
    }

    case 'block_suggestion': {
      return res.status(200).json({
        options: flowService.suggest(payload).map(o => {
          return {
            text: {
              type: 'plain_text',
              text: o.text,
              emoji: true,
            },
            value: o.value,
          }
        }),
      })
    }

    default: {
      logger.warn('slack.interactive.unknownPayloadType', { payload: req.body.payload })
      return res.sendStatus(200)
    }
  }
})

export { interactiveController }
