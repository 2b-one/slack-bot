/* eslint-disable @typescript-eslint/camelcase */
import { HomeScreenFlowAction } from './HomeScreenFlowAction'

export function getHomeView(items: { text: string; value: string }[]) {
  const blocks: Array<{}> = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Welcome!* \nThis is a home for 2B app. You can manage your notifications here.',
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: 'Source code is available on <https://github.com/2b-one/slack-bot|github>.',
        },
      ],
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Build notifications*',
      },
    },
  ]

  for (const item of items.slice(0, 30)) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: item.text,
      },
      accessory: {
        type: 'button',
        action_id: HomeScreenFlowAction.Unsubscribe,
        value: item.value,
        text: {
          type: 'plain_text',
          text: 'Unsubscribe',
          emoji: true,
        },
      },
    })
  }

  if (items.length === 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `You don't have any subscriptions yet`,
      },
    })
  }

  return {
    type: 'home',
    blocks: blocks,
  }
}
