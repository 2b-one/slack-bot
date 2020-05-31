import { BuildNotificationFlow } from './BuildNotificationFlow'
import { DeployFlow } from './DeployFlow'
import { CommandFlow, EventFlow, Flow } from './Flow'
import { HomeScreenFlow } from './HomeScreenFlow'

export const flows: Flow[] = [new BuildNotificationFlow(), new DeployFlow(), new HomeScreenFlow()]

export { Flow, CommandFlow, EventFlow }
