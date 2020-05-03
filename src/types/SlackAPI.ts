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

export interface BlockActionsPayload {
  type: 'block_actions'
  user: {
    id: string
    username: string
    name: string
    team_id: string
  }
  response_url: string
  actions: MultiStaticSelectAction[]
}
