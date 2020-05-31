import { Router } from 'express'
import { FlowService } from '../../services/FlowService'
import { serviceContainer } from '../../services/ServiceContainer'
import { EventRequestBody } from '../../types/SlackAPI'

const eventsController = Router()

eventsController.post<never, any, EventRequestBody>('/events', async (req, res) => {
  const payload = req.body
  switch (payload.type) {
    case 'url_verification':
      return res.status(200).send(payload.challenge)

    case 'event_callback': {
      const { event } = payload
      if (event.type === 'app_home_opened') {
        serviceContainer.get(FlowService).event(event)
      }
      return res.sendStatus(200)
    }

    default:
      return res.sendStatus(400)
  }
})

export { eventsController }
