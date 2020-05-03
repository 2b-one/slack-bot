import { Router } from 'express'
import { app } from '../../app'

const jenkinsController = Router()

jenkinsController.post('/jenkins', (req, res) => {
  const { projectId, branchName, success, buildUrl } = req.body
  app.reportBuild({ projectId, branchName, success, buildUrl })
  res.status(200).send('ok')
})

export { jenkinsController }
