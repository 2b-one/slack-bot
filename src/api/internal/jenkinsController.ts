import { Router } from 'express'
import { app } from '../../app'
import { BuildInfo } from '../../types'
import { logger } from '../../utils/logger'

const jenkinsController = Router()

jenkinsController.post('/jenkins', (req, res) => {
  if (isBuildInfo(req.body)) {
    app.reportBuild(req.body)
    res.sendStatus(200)
  } else {
    logger.warn('jenkins.badBuildInfo', { data: req.body })
    res.sendStatus(400)
  }
})

const buildInfoTuples = [
  ['jobId', 'string'],
  ['bitbucketProject', 'string'],
  ['bitbucketRepo', 'string'],
  ['branchName', 'string'],
  ['buildUrl', 'string'],
  ['success', 'boolean'],
]
function isBuildInfo(data: { [key: string]: any }): data is BuildInfo {
  for (const [key, type] of buildInfoTuples) {
    if (typeof data[key] !== type) {
      return false
    }
  }

  return Object.keys(data).length === buildInfoTuples.length
}

export { jenkinsController }
