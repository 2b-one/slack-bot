/* eslint-disable @typescript-eslint/camelcase */
import serializeForm from 'form-urlencoded'
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
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: serializeForm(data),
      username,
      password,
    })
    .then(() => true)
    .catch(error => {
      logger.error('jenkins.deploy', { error: error.message })
      return false
    })
}
