import { Router } from 'express'
import { app } from '../app'
import { SlackCommand } from '../types/SlackAPI'
import { respondWithText } from '../utils/responseToCommand'

const slackController = Router()

const errorBranchMsg = `command failed: incorrect branch`

slackController.post<{}, string, SlackCommand>('/commands', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/camelcase
  const { user_id, command, text, response_url } = req.body
  switch (command) {
    case '/2b-notified': {
      const [branch, project] = text.split(' ')
      res.status(200).send(branch ? 'command received' : errorBranchMsg)

      const projectIds = await app.projects.getProjectIds(branch)
      if (projectIds.length === 0) {
        return respondWithText(response_url, errorBranchMsg)
      }

      if (!project && projectIds.length === 1) {
        app.subscribe(user_id, branch, projectIds[0])
        return
      }

      if (project && projectIds.includes(project)) {
        app.subscribe(user_id, branch, project)
        return
      }

      return respondWithText(response_url, `${errorBranchMsg} or project`)
    }

    default: {
      res.status(200).send(`command "${command}" not found`)
      return
    }
  }
})

export { slackController }
