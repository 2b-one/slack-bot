import { Router } from 'express'
import { app } from '../app'
import { clientVerification } from './clientVerification'
import { SlackCommand } from './SlackCommand'

const Api = Router()

Api.use(clientVerification)
Api.post('/commands', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/camelcase
  const { team_id, user_id, command, text } = req.body as SlackCommand
  switch (command) {
    case '/pingme': {
      app.subscribe(team_id, user_id, 'fe', text)
      res.status(200).send('done.')
      return
    }

    case '/mypings': {
      const subs = app.getSubscriptions(team_id, user_id)
      res
        .status(200)
        .send(subs.map(sub => `${sub.projectId.toLocaleUpperCase()} ${sub.branchName}`).join('\n'))

      return
    }

    default: {
      res.status(200).send('Command not found.')
      return
    }
  }
})

export { Api }
