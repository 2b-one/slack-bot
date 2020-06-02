import { Router } from 'express'
import { BuildTrackService } from '../../services/BuildTrackService'
import { DeployTrackService } from '../../services/DeployTrackService'
import { serviceContainer } from '../../services/ServiceContainer'
import { BuildInfo, DeployInfo } from '../../types'
import { logger } from '../../utils/logger'

const jenkinsController = Router()

jenkinsController.post('/jenkins', (req, res) => {
  if (isBuildInfo(req.body)) {
    const buildTrackService = serviceContainer.get(BuildTrackService)
    buildTrackService.reportBuild(req.body)
    res.sendStatus(200)
  } else if (isDeployInfo(req.body)) {
    const deployTrackService = serviceContainer.get(DeployTrackService)
    deployTrackService.reportDeploy(req.body)
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

const deployInfoTuples = [
  ['trackId', 'string'],
  ['buildUrl', 'string'],
  ['success', 'boolean'],
]
const successDeployInfoTuples = [
  ['nomadUrl', 'string'],
  ['envUrl', 'string'],
]
function isDeployInfo(data: { [key: string]: any }): data is DeployInfo {
  for (const [key, type] of deployInfoTuples) {
    if (typeof data[key] !== type) {
      return false
    }
  }

  const success = (data as DeployInfo).success
  if (success) {
    for (const [key, type] of successDeployInfoTuples) {
      if (typeof data[key] !== type) {
        return false
      }
    }
  }

  const keysCount = Object.keys(data).length
  return success
    ? keysCount === deployInfoTuples.length + successDeployInfoTuples.length
    : keysCount === deployInfoTuples.length
}

export { jenkinsController }
