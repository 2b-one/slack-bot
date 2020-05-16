import { DeployFlow } from './DeployFlow'
import { Flow } from './Flow'
import { BuildNotificationFlow } from './BuildNotificationFlow'

export const flows: { [key: string]: Flow } = {
  '/2b-notified': new BuildNotificationFlow(),
  '/2b-deployed': new DeployFlow(),
}

export { Flow }
