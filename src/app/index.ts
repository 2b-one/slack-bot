import { sendMessage } from './utils/sendMessage'

interface BuildInfo {
  projectId: string
  branchName: string
  success: boolean
  buildUrl: string
}

class App {
  private subscriptions: { [key: string]: string[] } = {}

  subscribe(userId: string, projectId: string, branchName: string) {
    const key = getBuildKey(projectId, branchName)
    if (!this.subscriptions[key]) {
      this.subscriptions[key] = []
    }

    const subs = this.subscriptions[key]
    if (subs.every(user => user !== userId)) {
      subs.push(userId)
    }
  }

  reportBuild(buildInfo: BuildInfo) {
    const key = getBuildKey(buildInfo.projectId, buildInfo.branchName)
    const users = this.subscriptions[key] ?? []
    if (users.length === 0) {
      return
    }

    return sendMessage(
      users,
      `${buildInfo.projectId}:${buildInfo.branchName} has ${
        buildInfo.success ? 'been built' : 'failed'
      }. See details <${buildInfo.buildUrl}|here>.`,
    ).then(isOk => {
      if (isOk && buildInfo.success) {
        this.subscriptions[key] = []
      }
    })
  }
}

function getBuildKey(projectId: string, branchName: string) {
  return `${projectId}_${branchName}`
}

export const app = new App()
