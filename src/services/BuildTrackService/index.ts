import { BranchInfo, BuildInfo } from '../../types'
import { logger } from '../../utils/logger'
import { sendMessage } from '../../utils/sendMessage'

export class BuildTrackService {
  private subscriptions: { [key: string]: string[] } = {}

  subscribe(userId: string, branch: BranchInfo) {
    const key = serializeBranch(branch)
    if (!this.subscriptions[key]) {
      this.subscriptions[key] = []
    }

    const subs = this.subscriptions[key]
    if (subs.every(user => user !== userId)) {
      subs.push(userId)

      logger.info('buildTrackService.subscribe', { userId, branch })
    }
  }

  unsubscribe(userId: string, branch: BranchInfo) {
    const key = serializeBranch(branch)
    const userIds = this.subscriptions[key]
    if (userIds?.length === 0) {
      return
    }

    const userIndex = userIds.indexOf(userId)
    if (userIndex !== -1) {
      userIds.splice(userIndex, 1)
    }
  }

  getSubscriptions(userId: string): BranchInfo[] {
    const subscriptions = []
    for (const [serializedBranch, userIds] of Object.entries(this.subscriptions)) {
      if (userIds.includes(userId)) {
        const branch = parseBranch(serializedBranch)
        if (branch) {
          subscriptions.push(branch)
        }
      }
    }

    return subscriptions
  }

  reportBuild(data: BuildInfo) {
    const branch = {
      projectId: data.bitbucketProject,
      repositoryName: data.bitbucketRepo,
      branchName: data.branchName,
    }
    const key = serializeBranch(branch)
    const users = this.subscriptions[key] ?? []
    if (users.length === 0) {
      return
    }

    logger.info('buildTrackService.reportBuild', { users, data })

    users.forEach(user =>
      sendMessage(
        user,
        `*${data.bitbucketRepo}:${data.branchName}* has ${
          data.success ? 'been built' : 'failed'
        }. See details <${data.buildUrl}|here>.`,
      ).then(isOk => {
        if (isOk && data.success) {
          this.unsubscribe(user, branch)
        }
      }),
    )
  }
}

export function serializeBranch(branch: BranchInfo) {
  return [branch.projectId, branch.repositoryName, branch.branchName]
    .map(s => s.toLocaleLowerCase())
    .join('/')
}

export function parseBranch(maybeBranch?: string): BranchInfo | null {
  if (!maybeBranch) {
    return null
  }

  const [projectId, repositoryName, branchName] = maybeBranch.split('/')
  if (projectId && repositoryName && branchName) {
    return { projectId, repositoryName, branchName }
  }

  return null
}
