/* eslint-disable @typescript-eslint/camelcase */
import got from 'got'
import { logger } from '../../../../utils/logger'
import { ConfigService } from '../../../ConfigService'
import { serviceContainer } from '../../../ServiceContainer'

export function publishView(view: any, userId: string, hash?: string) {
  const token = serviceContainer.get(ConfigService).data.slack.appToken

  return got
    .post<{ ok: boolean }>('https://slack.com/api/views.publish', {
      responseType: 'json',
      headers: {
        authorization: `Bearer ${token}`,
      },
      json: {
        user_id: userId,
        view,
        hash,
      },
    })
    .then(res => res.body.ok)
    .catch(error => {
      logger.error('slack.views.publish', { error: error.message, view })
      return false
    })
}
