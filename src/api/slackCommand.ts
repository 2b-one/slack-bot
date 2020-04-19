import { Router } from 'express'
import { app } from '../app'

interface SlackCommand {
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

const slackCommand = Router()

slackCommand.post('/commands', async (req, res) => {
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
        .send(
          subs.length > 0
            ? subs.map(sub => `${sub.projectId.toLocaleUpperCase()} ${sub.branchName}`).join('\n')
            : `No active pings so far.`,
        )
      return
    }

    case '/mybuilds': {
      const builds = app.getBuildInfo()
      res
        .status(200)
        .send(
          builds.length > 0
            ? builds
                .map(
                  build =>
                    `projectId="${build.projectId}" branchName="${build.branchName}" success="${build.success}"`,
                )
                .join('\n')
            : 'No builds yet :(',
        )
      return
    }

    case '/clearmybuilds': {
      app.clearBuildInfo()
      res.status(200).send('OK')
      return
    }

    default: {
      res.status(200).send('Unrecognised command')
      return
    }
  }
})

export { slackCommand }
