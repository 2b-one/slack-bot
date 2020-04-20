declare module 'slack' {
  interface Conversations {
    open(opts: {
      token: string
      users?: string
    }): Promise<{
      ok: boolean
      no_op: boolean
      already_open: boolean
      channel: { id: string }
      error?: string
    }>
  }

  interface TextBlock {
    type: string
    [key: string]: string
  }

  interface Chat {
    postMessage(opts: {
      token: string
      channel: string
      text?: string
      blocks?: TextBlock[]
    }): Promise<{
      ok: boolean
      error?: string
    }>
  }

  class Slack {
    static readonly conversations: Conversations
    static readonly chat: Chat
  }

  // eslint-disable-next-line import/no-default-export
  export default Slack
}
