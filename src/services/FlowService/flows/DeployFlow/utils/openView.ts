/* eslint-disable @typescript-eslint/camelcase */
import got from 'got'
import { logger } from '../../../../../utils/logger'
import { ConfigService } from '../../../../ConfigService'
import { serviceContainer } from '../../../../ServiceContainer'

export function openView(view: any, triggerId: string) {
  const token = serviceContainer.get(ConfigService).data.slack.appToken

  return got
    .post('https://slack.com/api/views.open', {
      responseType: 'json',
      headers: {
        authorization: `Bearer ${token}`,
      },
      json: {
        trigger_id: triggerId,
        view,
      },
    })
    .then(() => {})
    .catch(error => {
      logger.error('slack.views.open', { error: error.message, view })
    })
}
