import Slack from 'slack'
import { logger } from './logger'

export function sendMessage(userId: string | string[], text: string) {
  const token = process.env.slack_app_token!
  const users = Array.isArray(userId) ? userId.join(',') : userId

  return Slack.conversations
    .open({ users, token })
    .then(result => {
      if (result.ok) {
        return result.channel.id
      }

      throw new Error(result.error)
    })
    .then(channel => Slack.chat.postMessage({ token, channel, text }))
    .then(result => result.ok)
    .catch(error => {
      logger.error('slack.sendMessage', { error: error.message })
    })
}
