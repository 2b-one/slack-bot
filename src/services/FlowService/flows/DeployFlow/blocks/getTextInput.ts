/* eslint-disable @typescript-eslint/camelcase */
export function getTextInput(
  paramName: string,
  actionId: string,
  options: {
    placeholder?: string
    initialValue?: string
    hint?: string
  },
) {
  return {
    type: 'input',
    block_id: actionId,
    label: {
      type: 'plain_text',
      text: paramName,
      emoji: true,
    },
    hint: options.hint && {
      type: 'plain_text',
      text: options.hint,
      emoji: true,
    },
    element: {
      type: 'plain_text_input',
      action_id: actionId,
      initial_value: options.initialValue,
      placeholder: options.placeholder && {
        type: 'plain_text',
        text: options.placeholder,
        emoji: true,
      },
      min_length: 3,
    },
  }
}
