import { Router } from 'express'
import { ProjectService } from '../../services/ProjectService'
import { serviceContainer } from '../../services/ServiceContainer'
import { BranchInfo } from '../../types'
import { logger } from '../../utils/logger'

const bitbucketController = Router()

bitbucketController.post('/bitbucket', (req, res) => {
  if (isBranchUpdateInfo(req.body)) {
    const projectService = serviceContainer.get(ProjectService)
    const { state, ...data } = req.body
    if (state.toLocaleLowerCase() === 'deleted') {
      projectService.removeBranch(data)
    } else {
      projectService.addBranch(data)
    }

    res.sendStatus(200)
  } else {
    logger.warn('bitbucket.badBranchUpdateInfo', { data: req.body })
    res.sendStatus(400)
  }
})

interface BranchUpdateInfo extends BranchInfo {
  state: 'created' | 'deleted'
}

const buildInfoTuples = [
  ['projectId', 'string'],
  ['repositoryName', 'string'],
  ['branchName', 'string'],
  ['state', 'string'],
]
function isBranchUpdateInfo(data: { [key: string]: any }): data is BranchUpdateInfo {
  for (const [key, type] of buildInfoTuples) {
    if (typeof data[key] !== type) {
      return false
    }
  }

  return Object.keys(data).length === buildInfoTuples.length
}

export { bitbucketController }
