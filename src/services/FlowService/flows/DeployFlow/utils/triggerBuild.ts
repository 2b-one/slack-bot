/* eslint-disable @typescript-eslint/camelcase */
import got from 'got'
import * as url from 'url'
import { logger } from '../../../../../utils/logger'
import { ConfigService } from '../../../../ConfigService'
import { serviceContainer } from '../../../../ServiceContainer'

export function triggerBuild(data: { [key: string]: any }) {
  const { host, deployJobPath, username, password } = serviceContainer.get(
    ConfigService,
  ).data.jenkins

  return got
    .post(url.resolve(host, deployJobPath), {
      // TODO: figure out jenkins certificate
      rejectUnauthorized: false,
      responseType: 'json',
      json: {
        parameters: Object.entries(data).map(([name, value]) => ({ name, value })),
      },
      username,
      password,
    })
    .then(() => true)
    .catch(error => {
      logger.error('jenkins.deploy', { error })
      return false
    })
}
