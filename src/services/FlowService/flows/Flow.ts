import {
  BlockActionsPayload,
  BlockSuggestionPayload,
  Command,
  CommandResponse,
  ViewSubmissionPayload,
} from '../../../types/SlackAPI'

export abstract class Flow {
  protected abstract actionIds: string[]

  abstract run(data: Command): CommandResponse | boolean

  continue(_data: BlockActionsPayload): void {}

  submit(_data: ViewSubmissionPayload): Promise<boolean> {
    return Promise.resolve(true)
  }

  suggest(_data: BlockSuggestionPayload): { text: string; value: string }[] {
    return []
  }

  match(actionId: string) {
    return this.actionIds.includes(actionId)
  }
}
