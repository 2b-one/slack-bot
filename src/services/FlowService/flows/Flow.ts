import { BlockActionsPayload, Command, CommandResponse } from '../../../types/SlackAPI'

let lastCreatedFlow = 0

export abstract class Flow {
  protected id = `$${lastCreatedFlow++}`

  constructor(protected cmd: Command) {}

  abstract start(): CommandResponse

  abstract continue(data: BlockActionsPayload): boolean

  match(actionId: string) {
    return actionId.split('_')[0] === this.id
  }

  getActionId(actionName: string) {
    return `${this.id}_${actionName}`
  }
}
