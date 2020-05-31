/* eslint-disable @typescript-eslint/camelcase */
import serializeForm from 'form-urlencoded'
import got, { TimeoutError } from 'got'
import * as url from 'url'
import { ConfigService } from '../services/ConfigService'
import { serviceContainer } from '../services/ServiceContainer'
import { logger } from './logger'

export function triggerBuild(data: { [key: string]: any }) {
  const { host, deployJobPath, username, password } = serviceContainer.get(
    ConfigService,
  ).data.jenkins

  return got
    .post(url.resolve(host, deployJobPath), {
      // TODO: figure out jenkins certificate
      rejectUnauthorized: false,
      timeout: 2000,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: serializeForm(data),
      username,
      password,
    })
    .then(() => true)
    .catch(error => {
      /**
       * Jenkins sometimes responds really slow but still schedules the build,
       * so we treat timeouted responses as successful.
       */
      if (error instanceof TimeoutError) {
        return true
      }

      logger.error('jenkins.deploy', { error: error.message })
      return false
    })
}
