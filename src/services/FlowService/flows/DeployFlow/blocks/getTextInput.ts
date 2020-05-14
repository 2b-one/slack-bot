/* eslint-disable @typescript-eslint/camelcase */
export function getTextInput(paramName: string, actionId: string) {
  return {
    type: 'input',
    block_id: actionId,
    label: {
      type: 'plain_text',
      text: paramName,
      emoji: true,
    },
    element: {
      type: 'plain_text_input',
      action_id: actionId,
      placeholder: {
        type: 'plain_text',
        text: 'environment name',
        emoji: true,
      },
      min_length: 3,
    },
  }
}
