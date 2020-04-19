import { Router } from 'express'
import { app } from '../app'

const jenkins = Router()

jenkins.post('/jenkins', (req, res) => {
  const { projectId, branchName, success } = req.body
  app.reportBuild(projectId, branchName, success)
  res.status(200).send('OK')
})

export { jenkins }
