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
  action_ts: string
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
}

export interface ButtonAction {
  type: 'button'
  block_id: string
  action_id: string
  action_ts: string
  value?: string
}

interface User {
  id: string
  username: string
  name: string
  team_id: string
}

export interface BlockActionsPayload<
  TActions extends Array<unknown> = unknown[],
  TView extends any = any
> {
  type: 'block_actions'
  user: User
  response_url: string
  actions: TActions
  view?: View<TView>
}

export interface BlockSuggestionPayload {
  type: 'block_suggestion'
  user: User
  action_id: string
  value: string
}

interface View<T> {
  id: string
  type: string
  hash: string
  callback_id: string
  blocks: any
  state: {
    values: T
  }
}

export interface ViewSubmissionPayload<T extends { [key: string]: any } = { [key: string]: any }> {
  type: 'view_submission'
  user: User
  view: View<T>
}

export type InteractivePayload =
  | BlockActionsPayload
  | ViewSubmissionPayload
  | BlockSuggestionPayload

export interface ResponseActionError {
  response_action: 'errors'
  errors: {
    [key: string]: string
  }
}

interface ResponseActionClear {
  response_action: 'clear'
}

export type ResponseAction = ResponseActionError | ResponseActionClear

interface UrlVerificationEvent {
  type: 'url_verification'
  token: string
  challenge: string
}

interface EventCallback<T> {
  type: 'event_callback'
  event: T
}

export interface AppHomeOpenedEvent<T> {
  type: 'app_home_opened'
  user: string
  tab: string
  view?: View<T>
}

export type Event = AppHomeOpenedEvent<any>
export type EventRequestBody = UrlVerificationEvent | EventCallback<Event>
