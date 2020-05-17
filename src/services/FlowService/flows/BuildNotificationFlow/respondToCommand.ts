import got from 'got'
import { logger } from '../../../../utils/logger'

export function respondToCommand(responseUrl: string, data: any): Promise<void> {
  return got
    .post(responseUrl, { json: data })
    .then(() => {})
    .catch(error => {
      logger.error('slack.respondToCommand', { error: error.message, data })
    })
}
