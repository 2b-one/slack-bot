/* eslint-disable @typescript-eslint/camelcase */
import { BlockActionsPayload, Command, CommandResponse } from '../../types/SlackAPI'
import { Flow } from './flows/Flow'
import { SubscribeFlow } from './flows/SubscribeFlow'

export class FlowService {
  private flows: { [key: string]: { new (cmd: Command): Flow } } = {
    '/2b-notified': SubscribeFlow,
  }

  private flowInstances: Flow[] = []

  start(cmd: Command): CommandResponse {
    const Flow = this.flows[cmd.command]
    if (!Flow) {
      return { text: `command "${cmd.command}" not found` }
    }

    const flow = new Flow(cmd)
    this.flowInstances.push(flow)
    return flow.start()
  }

  continue(data: BlockActionsPayload<any[]>) {
    const actionId = data.actions[0]?.action_id
    const flow = this.flowInstances.find(flowInstance => flowInstance.match(actionId))
    if (!flow) {
      return
    }

    const isFinished = flow.continue(data)
    if (isFinished) {
      this.flowInstances = this.flowInstances.filter(f => f !== flow)
    }
  }
}
