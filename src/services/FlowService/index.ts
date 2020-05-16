/* eslint-disable @typescript-eslint/camelcase */
import {
  BlockActionsPayload,
  BlockSuggestionPayload,
  Command,
  CommandResponse,
  ViewSubmissionPayload,
} from '../../types/SlackAPI'
import { flows } from './flows'

const flowInstances = Object.values(flows)

export class FlowService {
  run(data: Command): CommandResponse {
    const flow = flows[data.command]
    if (!flow) {
      return { text: `command "${data.command}" not found` }
    }

    const response = flow.run(data)
    if (typeof response === 'object') {
      return response
    }

    return response ? { text: 'command received' } : { text: 'command failed' }
  }

  continue(data: BlockActionsPayload<any[]>) {
    const actionId = data.actions[0]?.action_id
    const flow = flowInstances.find(flowInstance => flowInstance.match(actionId))
    if (!flow) {
      return
    }

    flow.continue(data)
  }

  submit(data: ViewSubmissionPayload) {
    const flow = flowInstances.find(flowInstance => flowInstance.match(data.view.callback_id))
    if (!flow) {
      return
    }

    return flow.submit(data)
  }

  suggest(data: BlockSuggestionPayload) {
    const actionId = data.action_id
    const flow = flowInstances.find(flowInstance => flowInstance.match(actionId))
    return flow ? flow.suggest(data) : []
  }
}
