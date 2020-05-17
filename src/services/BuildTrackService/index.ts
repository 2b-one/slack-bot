import { BranchInfo, BuildInfo } from '../../types'
import { logger } from '../../utils/logger'
import { sendMessage } from '../../utils/sendMessage'

export class BuildTrackService {
  private subscriptions: { [key: string]: string[] } = {}

  subscribe(userId: string, branch: BranchInfo) {
    const key = getBuildKey(branch)
    if (!this.subscriptions[key]) {
      this.subscriptions[key] = []
    }

    const subs = this.subscriptions[key]
    if (subs.every(user => user !== userId)) {
      subs.push(userId)

      logger.info('buildTrackService.subscribe', { userId, branch })
    }
  }

  reportBuild(data: BuildInfo) {
    const key = getBuildKey({
      projectId: data.bitbucketProject,
      repositoryName: data.bitbucketRepo,
      branchName: data.branchName,
    })
    const users = this.subscriptions[key] ?? []
    if (users.length === 0) {
      return
    }

    logger.info('buildTrackService.reportBuild', { ...data, users })

    users.forEach(user =>
      sendMessage(
        user,
        `*${data.bitbucketRepo}:${data.branchName}* has ${
          data.success ? 'been built' : 'failed'
        }. See details <${data.buildUrl}|here>.`,
      ).then(isOk => {
        if (isOk && data.success) {
          this.subscriptions[key] = []
        }
      }),
    )
  }
}

function getBuildKey(branch: BranchInfo) {
  return [branch.projectId, branch.repositoryName, branch.branchName]
    .map(s => s.toLocaleLowerCase())
    .join('_')
}
