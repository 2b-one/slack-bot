import { logger } from '../logger'
import { isBranchExist } from './utils/isBranchExist'
import { sendMessage } from './utils/sendMessage'

interface BuildInfo {
  projectId: string
  branchName: string
  success: boolean
  buildUrl: string
}

class App {
  private subscriptions: { [key: string]: string[] } = {}
  private projects = ['one-metadata-server', 'one-metadata-frontend']

  getProjectIds(branchName: string) {
    return Promise.all(this.projects.map(projectId => isBranchExist(branchName, projectId))).then(
      result => {
        const matchedProjectsIds = []
        for (let i = 0; i < result.length; i++) {
          if (result[i]) {
            matchedProjectsIds.push(this.projects[i])
          }
        }
        return matchedProjectsIds
      },
    )
  }

  subscribe(userId: string, branchName: string, projectId: string) {
    logger.info('app.subscribe', { userId, projectId, branchName })

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
    logger.info('app.reportBuild', buildInfo)

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
