/* eslint-disable @typescript-eslint/camelcase */
import {
  BlockActionsPayload,
  BlockSuggestionPayload,
  Command,
  CommandResponse,
  Event,
  ViewSubmissionPayload,
} from '../../types/SlackAPI'
import { CommandFlow, EventFlow, flows } from './flows'

export class FlowService {
  run(data: Command): CommandResponse {
    const flow: CommandFlow | undefined = flows.find(
      flowInstance => flowInstance instanceof CommandFlow && flowInstance.command === data.command,
    ) as CommandFlow

    if (!flow) {
      return { text: `Command "${data.command}" not found` }
    }

    const response = flow.run(data)
    if (typeof response === 'object') {
      return response
    }

    return response ? { text: 'Command received' } : { text: 'Command failed' }
  }

  event(data: Event) {
    const flow = flows.find(
      flowInstance =>
        flowInstance instanceof EventFlow && flowInstance.eventTypes.includes(data.type),
    ) as EventFlow
    if (!flow) {
      return
    }

    flow.event(data)
  }

  continue(data: BlockActionsPayload<any[]>) {
    const actionId = data.actions[0]?.action_id
    const flow = flows.find(flowInstance => flowInstance.actionIds.includes(actionId))
    if (!flow) {
      return
    }

    flow.continue(data)
  }

  submit(data: ViewSubmissionPayload) {
    const actionId = data.view.callback_id
    const flow = flows.find(flowInstance => flowInstance.actionIds.includes(actionId))
    if (!flow) {
      return
    }

    return flow.submit(data)
  }

  suggest(data: BlockSuggestionPayload) {
    const actionId = data.action_id
    const flow = flows.find(flowInstance => flowInstance.actionIds.includes(actionId))
    return flow ? flow.suggest(data) : []
  }
}
