import { Router } from 'express'
import { HomeService } from '../../services/HomeService'
import { serviceContainer } from '../../services/ServiceContainer'
import { Event } from '../../types/SlackAPI'

const eventsController = Router()

eventsController.post<never, any, Event>('/events', async (req, res) => {
  const payload = req.body
  switch (payload.type) {
    case 'url_verification':
      return res.status(200).send(payload.challenge)

    case 'event_callback': {
      const { event } = payload
      if (event.type === 'app_home_opened') {
        serviceContainer.get(HomeService).handle(event)
      }
      return res.sendStatus(200)
    }

    default:
      return res.sendStatus(400)
  }
})

export { eventsController }
