import { Router } from 'express'
import { app } from '../app'

interface SlackCommandBody {
  token: string
  team_id: string
  team_domain: string
  channel_id: string
  channel_name: string
  user_id: string
  user_name: string
  command: string
  text: string
  response_url: string
  trigger_id: string
}

const slackController = Router()

slackController.post<{}, string, SlackCommandBody>('/commands', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/camelcase
  const { user_id, command, text } = req.body
  switch (command) {
    case '/2b-notified': {
      const [project, branch] = text.split(' ')
      let resText = 'ok'
      if (branch && project) {
        app.subscribe(user_id, project, branch)
      } else {
        resText = `Incorrect branch or project name`
      }

      return res.status(200).send(resText)
    }

    default: {
      res.status(200).send(`Command "${command}" is not found`)
      return
    }
  }
})

export { slackController }
