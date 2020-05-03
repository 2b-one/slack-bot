/* eslint-disable @typescript-eslint/camelcase */
import { Router } from 'express'
import { app } from '../../app'
import { BlockActionsPayload, MultiStaticSelectAction } from '../../types/SlackAPI'
import { logger } from '../../utils/logger'
import { responseToCommand } from '../../utils/responseToCommand'
import { Action } from './utils/Action'

const interactiveController = Router()

interactiveController.post('/interactive', (req, res) => {
  res.sendStatus(200)

  try {
    const payload: BlockActionsPayload = JSON.parse(req.body.payload)
    if (payload.type === 'block_actions') {
      return handleActions(payload)
    } else {
      logger.warn('slack.interactiveResponse.unknownPayloadType', { payload: req.body.payload })
    }
  } catch (e) {
    logger.error('slack.interactiveResponse', { payload: req.body.payload })
  }
})

function handleActions(payload: BlockActionsPayload) {
  const { actions, response_url, user } = payload
  if (actions.length === 1 && isSelectAction(actions[0])) {
    const selectAction = actions[0]
    if (selectAction.selected_options.length === 0) {
      return
    }

    if (selectAction.action_id === Action.TrackBranch) {
      const tracked = []
      for (const option of selectAction.selected_options) {
        const [branchName, projectId] = option.value.split(' ')
        app.subscribe(user.id, branchName, projectId)
        tracked.push(`${projectId}/${branchName}`)
      }

      return responseToCommand(response_url, {
        text: `command processed: watching for ${tracked.map(t => `\`${t}\``).join(', ')}`,
      })
    }
  }

  logger.warn('slack.interactiveResponse.unknownAction', { payload })
}

function isSelectAction(action: any): action is MultiStaticSelectAction {
  return action?.type === 'multi_static_select'
}

export { interactiveController }
