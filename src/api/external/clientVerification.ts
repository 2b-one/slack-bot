import crypto from 'crypto'
import { RequestHandler } from 'express'
import { ConfigService } from '../../services/ConfigService'
import { serviceContainer } from '../../services/ServiceContainer'
import { logger } from '../../utils/logger'

/**
 * Validates requests from slack API
 * https://api.slack.com/authentication/verifying-requests-from-slack
 */
export const clientVerification: RequestHandler = (req, res, next) => {
  const requestSignature = req.header('x-slack-signature') as string
  const requestTimestamp = req.header('x-slack-request-timestamp')
  const configService = serviceContainer.get(ConfigService)

  const [version, hash] = requestSignature.split('=')
  const reqHash = crypto
    .createHmac('sha256', configService.data.slack.signSecret)
    .update(`${version}:${requestTimestamp}:${(req as any).rawBody}`)
    .digest('hex')

  const strToBuffer = new TextEncoder()
  const isValid = crypto.timingSafeEqual(strToBuffer.encode(reqHash), strToBuffer.encode(hash))
  if (isValid) {
    next()
  } else {
    logger.error('slack.unauthorizedRequest', { path: `${req.baseUrl}${req.path}` })
    res.sendStatus(403)
  }
}
