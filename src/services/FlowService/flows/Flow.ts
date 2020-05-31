import {
  BlockActionsPayload,
  BlockSuggestionPayload,
  Command,
  CommandResponse,
  Event,
  ResponseAction,
  ViewSubmissionPayload,
} from '../../../types/SlackAPI'

export abstract class Flow {
  abstract readonly actionIds: string[]

  continue(_data: BlockActionsPayload): void {}

  submit(_data: ViewSubmissionPayload): Promise<boolean | ResponseAction> {
    return Promise.resolve(true)
  }

  suggest(_data: BlockSuggestionPayload): { text: string; value: string }[] {
    return []
  }
}

export abstract class CommandFlow extends Flow {
  abstract readonly command: string

  abstract run(data: Command): CommandResponse | boolean
}

export abstract class EventFlow extends Flow {
  abstract readonly eventTypes: string[]

  abstract event(data: Event): void
}
