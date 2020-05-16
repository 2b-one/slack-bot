interface Option {
  text: string
  value: string
}

interface OptionObject {
  text: {
    type: 'plain_text'
    text: string
    emoji: boolean
  }
  value: string
}

/**
 * Slack API has very specific requirements for option objects and if they aren't met
 * whole option list will be rejected.
 *
 * @see {@link https://api.slack.com/reference/block-kit/composition-objects#option}
 * @param options
 */
export function createSafeOptions(options: Option[]): OptionObject[] {
  return options.slice(0, 100).map(o => {
    return {
      text: {
        type: 'plain_text',
        text: o.text.slice(0, 75),
        emoji: true,
      },
      value: o.value.slice(0, 75),
    }
  })
}
