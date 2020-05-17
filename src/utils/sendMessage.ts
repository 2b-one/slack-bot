import Slack from 'slack'
import { ConfigService } from '../services/ConfigService'
import { serviceContainer } from '../services/ServiceContainer'
import { logger } from './logger'

export function sendMessage(userId: string, text: string) {
  const token = serviceContainer.get(ConfigService).data.slack.appToken

  return Slack.conversations
    .open({ users: userId, token })
    .then(result => {
      if (result.ok) {
        return result.channel.id
      }

      throw new Error(result.error)
    })
    .then(channel => Slack.chat.postMessage({ token, channel, text }))
    .then(result => result.ok)
    .catch(error => {
      logger.error('slack.sendMessage', { error: error.message, userId })
    })
}
