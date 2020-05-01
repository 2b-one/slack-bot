import got from 'got'
import { logger } from './logger'

export function responseToCommand(responseUrl: string, payload: any): Promise<void> {
  return got
    .post(responseUrl, { json: payload })
    .then(() => {})
    .catch(error => {
      logger.error('slack.commandResponse', error)
    })
}

export function respondWithText(responseUrl: string, text: string): Promise<void> {
  return responseToCommand(responseUrl, { text })
}
