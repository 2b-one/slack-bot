import { DeployInfo } from '../../types'
import { logger } from '../../utils/logger'
import { sendMessage } from '../../utils/sendMessage'

export class DeployTrackService {
  private subscriptions: { [key: string]: string[] } = {}

  subscribe(userId: string, trackId: string) {
    if (!this.subscriptions[userId]) {
      this.subscriptions[userId] = []
    }

    const trackIds = this.subscriptions[userId]
    if (!trackIds.includes(trackId)) {
      trackIds.push(trackId)

      logger.info('deployTrackService.subscribe', { userId, trackId })
    }
  }

  reportDeploy(data: DeployInfo) {
    const result = Object.entries(this.subscriptions).find(([, trackIds]) =>
      trackIds.includes(data.trackId),
    )

    if (!result) {
      return
    }

    const [userId, trackIds] = result
    logger.info('deployTrackService.reportDeploy', { userId, data })

    const message = data.success
      ? `Deployment is finished: <${data.envUrl}|${data.envUrl}>`
      : `Deployment has failed, see details <${data.buildUrl}|here>.`

    sendMessage(userId, message).then(() => {
      this.subscriptions[userId] = trackIds.filter(id => id !== data.trackId)
    })
  }
}
