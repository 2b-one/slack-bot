import Slack from 'slack'

export function sendMessage(userId: string | string[], text: string) {
  const token = process.env.app_token!
  const users = Array.isArray(userId) ? userId.join(',') : userId

  return Slack.conversations
    .open({ users, token })
    .then(result => {
      if (!result.ok) {
        throw new Error(result.error)
      }

      return result.channel.id
    })
    .then(channel => Slack.chat.postMessage({ token, channel, text }))
    .then(result => result.ok)
    .catch(console.error)
}
