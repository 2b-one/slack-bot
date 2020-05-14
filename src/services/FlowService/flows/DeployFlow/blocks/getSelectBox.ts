/* eslint-disable @typescript-eslint/camelcase */
export function getSelectBox(paramName: string, actionId: string, defaultValue: string) {
  return {
    type: 'input',
    block_id: actionId,
    label: {
      type: 'plain_text',
      text: paramName,
      emoji: true,
    },
    element: {
      type: 'external_select',
      action_id: actionId,
      initial_option: {
        text: {
          type: 'plain_text',
          text: defaultValue,
        },
        value: defaultValue,
      },
      placeholder: {
        type: 'plain_text',
        text: 'Select an item',
        emoji: true,
      },
    },
  }
}
