import { BranchInfo, BuildInfo } from '../../types'
import { logger } from '../../utils/logger'

type Callback = (userId: string, data: BuildInfo, unsubscribe: () => void) => void

interface Subscription {
  userId: string
  callback: Callback
}

export class BuildTrackService {
  private subscriptions: { [key: string]: Subscription[] } = {}

  subscribe(userId: string, branch: BranchInfo, callback: Callback) {
    const key = serializeBranch(branch)
    if (!this.subscriptions[key]) {
      this.subscriptions[key] = []
    }

    const subs = this.subscriptions[key]
    if (subs.every(sub => sub.userId !== userId)) {
      subs.push({ userId, callback })
      logger.info('buildTrackService.subscribe', { userId, branch })
    }
  }

  unsubscribe(userId: string, branch: BranchInfo) {
    const key = serializeBranch(branch)
    const success = this._unsubscribe(userId, key)
    if (success) {
      logger.info('buildTrackService.unsubscribe', { userId, branch })
    }
  }

  getSubscriptions(userId: string): BranchInfo[] {
    const subscriptions = []
    for (const [serializedBranch, subs] of Object.entries(this.subscriptions)) {
      if (subs.some(sub => sub.userId === userId)) {
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
    const subs = this.subscriptions[key] ?? []
    if (subs.length === 0) {
      return
    }

    logger.info('buildTrackService.reportBuild', { users: subs.map(sub => sub.userId), data })
    for (const sub of subs) {
      sub.callback(sub.userId, data, () => this._unsubscribe(sub.userId, key))
    }
  }

  private _unsubscribe(userId: string, key: string) {
    const subs = this.subscriptions[key]
    if (!subs?.length) {
      return false
    }

    const subIndex = subs.findIndex(sub => sub.userId === userId)
    if (subIndex === -1) {
      return false
    }

    subs.splice(subIndex, 1)
    return true
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
