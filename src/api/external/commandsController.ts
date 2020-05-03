/* eslint-disable @typescript-eslint/camelcase */
import { Router } from 'express'
import { app } from '../../app'
import { Command, CommandResponse } from '../../types/SlackAPI'
import { responseToCommand } from '../../utils/responseToCommand'
import { Action } from './utils/Action'

const commandsController = Router()

const errorBranchMsg = `command failed: incorrect branch`

commandsController.post<{}, CommandResponse, Command>('/commands', async (req, res) => {
  const { user_id, command, text, response_url } = req.body
  switch (command) {
    case '/2b-notified': {
      const [branch, project] = text.split(' ')
      res.status(200).json({ text: branch ? 'command received' : errorBranchMsg })

      const projectIds = await app.projects.getProjectIds(branch)
      if (projectIds.length === 0) {
        return responseToCommand(response_url, { text: errorBranchMsg })
      }

      if (!project) {
        if (projectIds.length === 1) {
          return app.subscribe(user_id, branch, projectIds[0])
        } else {
          return responseToCommand(response_url, {
            text: 'input required',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `\`${branch}\` found in multiple projects - user input required`,
                },
                accessory: {
                  // https://api.slack.com/reference/block-kit/block-elements#static_multi_select
                  type: 'multi_static_select',
                  action_id: Action.TrackBranch,
                  placeholder: {
                    type: 'plain_text',
                    text: 'select projects to track',
                  },
                  options: projectIds.map(projectId => {
                    return {
                      value: [branch, projectId].join(' '),
                      text: {
                        type: 'plain_text',
                        text: projectId,
                      },
                    }
                  }),
                },
              },
            ],
          })
        }
      }

      if (projectIds.includes(project)) {
        app.subscribe(user_id, branch, project)
        return
      }

      return responseToCommand(response_url, { text: `${errorBranchMsg} or project` })
    }

    default: {
      res.status(200).json({ text: `command "${command}" not found` })
      return
    }
  }
})

export { commandsController }
