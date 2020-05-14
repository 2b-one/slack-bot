import {
  BlockActionsPayload,
  BlockSuggestionPayload,
  Command,
  CommandResponse,
  ViewSubmissionPayload,
} from '../../../types/SlackAPI'

interface Option {
  text: string
  value: string
}

export abstract class Flow {
  protected abstract actionIds: string[]

  abstract run(data: Command): CommandResponse | boolean
  continue(_data: BlockActionsPayload): void {}
  submit(_data: ViewSubmissionPayload): void {}
  suggest(_data: BlockSuggestionPayload): Option[] {
    return []
  }

  match(actionId: string) {
    return this.actionIds.includes(actionId)
  }
}
