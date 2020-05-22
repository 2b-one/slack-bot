import { Router } from 'express'
import { ProjectService } from '../../services/ProjectService'
import { serviceContainer } from '../../services/ServiceContainer'
import { logger } from '../../utils/logger'

const bitbucketHookController = Router()

bitbucketHookController.post('/bitbucket-hook', (req, res) => {
  const data = req.body
  if (isPushEvent(data)) {
    const projectService = serviceContainer.get(ProjectService)
    for (const change of data.changes) {
      const branch = {
        projectId: data.repository.project.key,
        repositoryName: data.repository.slug,
        branchName: change.ref.displayId,
      }

      if (change.type === 'ADD') {
        projectService.addBranch(branch)
      } else if (change.type === 'DELETE') {
        projectService.removeBranch(branch)
      }
    }
  } else {
    logger.warn('bitbucket.unknownRepositoryEvent', { data })
  }

  res.sendStatus(200)
})

function isPushEvent(data: { [key: string]: any }): data is BitbucketRepositoryPushEvent {
  return data?.eventKey === 'repo:refs_changed'
}

interface BitbucketRepositoryPushEvent {
  eventKey: 'repo:refs_changed'
  date: string
  actor: {
    id: number
    slug: string
    name: string
    displayName: string
    emailAddress: string
    active: boolean
    type: string
  }
  repository: {
    id: number
    slug: string
    name: string
    project: {
      id: number
      key: string
      name: string
    }
  }
  changes: BitbucketRepositoryChange[]
}

interface BitbucketRepositoryChange {
  ref: {
    displayId: string
    type: 'BRANCH'
  }
  type: 'ADD' | 'UPDATE' | 'DELETE'
}

export { bitbucketHookController }
