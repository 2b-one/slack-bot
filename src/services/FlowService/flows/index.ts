import { DeployFlow } from './DeployFlow'
import { Flow } from './Flow'
import { SubscribeFlow } from './SubscribeFlow'

export const flows: { [key: string]: Flow } = {
  '/2b-notified': new SubscribeFlow(),
  '/2b-deployed': new DeployFlow(),
}

export { Flow }
