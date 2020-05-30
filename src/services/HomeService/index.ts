import { AppHomeOpenedEvent } from '../../types/SlackAPI'
import { publishView } from './publishView'

export class HomeService {
  handle(event: AppHomeOpenedEvent<any>) {
    if (event.tab === 'home') {
      publishView(
        {
          type: 'home',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Hello Home Tab',
              },
            },
          ],
        },
        event.user,
        event.view?.hash,
      )
    }
  }
}
