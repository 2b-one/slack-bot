import { BranchInfo, BuildInfo } from '../../types'
import { logger } from '../../utils/logger'
import { sendMessage } from '../../utils/sendMessage'

export class SubscriptionService {
  private subscriptions: { [key: string]: string[] } = {}

  subscribe(userId: string, branch: BranchInfo) {
    const key = getBuildKey(branch)
    if (!this.subscriptions[key]) {
      this.subscriptions[key] = []
    }

    const subs = this.subscriptions[key]
    if (subs.every(user => user !== userId)) {
      subs.push(userId)

      logger.info('subscriptionService.subscribe', { userId, branch })
    }
  }

  reportBuild(buildInfo: BuildInfo) {
    const key = getBuildKey({
      projectId: buildInfo.bitbucketProject,
      repositoryName: buildInfo.bitbucketRepo,
      branchName: buildInfo.branchName,
    })
    const users = this.subscriptions[key] ?? []
    if (users.length === 0) {
      return
    }

    logger.info('subscriptionService.reportBuild', buildInfo)

    return sendMessage(
      users,
      `${buildInfo.bitbucketRepo}:${buildInfo.branchName} has ${
        buildInfo.success ? 'been built' : 'failed'
      }. See details <${buildInfo.buildUrl}|here>.`,
    ).then(isOk => {
      if (isOk && buildInfo.success) {
        this.subscriptions[key] = []
      }
    })
  }
}

function getBuildKey(branch: BranchInfo) {
  return `${branch.projectId}_${branch.repositoryName}_${branch.branchName}`
}
