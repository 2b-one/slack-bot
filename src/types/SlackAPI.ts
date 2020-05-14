export interface Command {
  token: string
  team_id: string
  team_domain: string
  channel_id: string
  channel_name: string
  user_id: string
  user_name: string
  command: string
  text: string
  response_url: string
  trigger_id: string
}

export interface CommandResponse {
  text?: string
  blocks?: any
  replace_original?: boolean
}

export interface MultiStaticSelectAction {
  type: 'multi_static_select'
  block_id: string
  action_id: string
  selected_options: Array<{
    value: string
    text: {
      type: string
      text: string
      emoji: boolean
    }
  }>
  placeholder: {
    type: string
    text: string
    emoji: boolean
  }
  action_ts: string
}

interface User {
  id: string
  username: string
  name: string
  team_id: string
}

export interface BlockActionsPayload<T extends Array<unknown> = unknown[]> {
  type: 'block_actions'
  user: User
  response_url: string
  actions: T
}

export interface BlockSuggestionPayload {
  type: 'block_suggestion'
  user: User
  action_id: string
  value: string
}

export interface ViewSubmissionPayload<T extends { [key: string]: any } = { [key: string]: any }> {
  type: 'view_submission'
  user: User
  view: {
    callback_id: string
    state: {
      values: T
    }
  }
}

export type InteractivePayload =
  | BlockActionsPayload
  | ViewSubmissionPayload
  | BlockSuggestionPayload
