/* eslint-disable @typescript-eslint/camelcase */
import got from 'got'
import { ConfigService } from '../services/ConfigService'
import { serviceContainer } from '../services/ServiceContainer'
import { logger } from './logger'

export function getBuildParameters(url: string): { [key: string]: any } | null {
  const { username, password } = serviceContainer.get(ConfigService).data.jenkins

  return got
    .post<any>(url, {
      // TODO: figure out jenkins certificate
      rejectUnauthorized: false,
      responseType: 'json',
      timeout: 10000,
      username,
      password,
    })
    .then<any>(res => {
      const parameters = res.body?.actions?.find(
        (action: any) => action._class === 'hudson.model.ParametersAction',
      )?.parameters

      if (!parameters) {
        logger.error('jenkins.getBuildParameters.badData', { data: res.body, url })
        return null
      }

      const values: { [key: string]: any } = {}
      for (const p of parameters) {
        values[p.name] = p.value
      }

      return values
    })
    .catch(error => {
      logger.error('jenkins.getBuildParameters', { error: error.message, url })
      return {}
    })
}
