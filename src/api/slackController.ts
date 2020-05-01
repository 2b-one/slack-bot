import { Router } from 'express'
import { app } from '../app'
import { SlackCommand } from '../types/SlackAPI'

const slackController = Router()

slackController.post<{}, string, SlackCommand>('/commands', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/camelcase
  const { user_id, command, text } = req.body
  switch (command) {
    case '/2b-notified': {
      const [branch, project] = text.split(' ')
      if (!branch) {
        return res.status(200).send(`Incorrect branch or project name`)
      }

      const projectIds = await app.getProjectIds(branch)
      if (projectIds.length === 0) {
        return res.status(200).send(`Incorrect branch or project name`)
      }

      if (!project && projectIds.length === 1) {
        app.subscribe(user_id, branch, projectIds[0])
        return res.status(200).send('ok')
      }

      if (project && projectIds.includes(project)) {
        app.subscribe(user_id, branch, project)
        return res.status(200).send('ok')
      }

      return res.status(200).send(`Incorrect branch or project name`)
    }

    default: {
      res.status(200).send(`Command "${command}" is not found`)
      return
    }
  }
})

export { slackController }
