/* eslint-disable @typescript-eslint/camelcase */
import { Router } from 'express'
import { app } from '../../app'
import { ProjectService } from '../../services/ProjectService'
import { serviceContainer } from '../../services/ServiceContainer'
import { Command, CommandResponse } from '../../types/SlackAPI'
import { Action } from './utils/Action'

const commandsController = Router()

commandsController.post<{}, CommandResponse, Command>('/commands', async (req, res) => {
  const { user_id, command, text } = req.body
  switch (command) {
    case '/2b-notified': {
      const branch = text

      const projectService = serviceContainer.get(ProjectService)
      const branches = projectService.findBranch(branch)
      if (branches.length === 0) {
        return res.status(200).json({ text: `command failed: incorrect branch` })
      }

      if (branches.length === 1) {
        app.subscribe(user_id, branch, branches[0].repositoryName)
        return res.status(200).json({ text: 'command received' })
      }

      return res.status(200).json({
        text: 'input required',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `branch \`${branch}\` found in multiple projects - user input required`,
            },
            accessory: {
              // https://api.slack.com/reference/block-kit/block-elements#static_multi_select
              type: 'multi_static_select',
              action_id: Action.TrackBranch,
              placeholder: {
                type: 'plain_text',
                text: 'Select projects to track',
              },
              options: branches.map(branchInfo => {
                return {
                  value: [branch, branchInfo.repositoryName].join(' '),
                  text: {
                    type: 'plain_text',
                    text: branchInfo.repositoryName,
                  },
                }
              }),
            },
          },
        ],
      })
    }

    default: {
      res.status(200).json({ text: `command "${command}" not found` })
      return
    }
  }
})

export { commandsController }
