class App {
  private subscriptions: { [key: string]: Array<{ projectId: string; branchName: string }> } = {}
  private builds: Array<{ projectId: string; branchName: string; success: boolean }> = []

  subscribe(teamId: string, userId: string, projectId: string, branchName: string) {
    const key = this.getKey(teamId, userId)
    if (!this.subscriptions[key]) {
      this.subscriptions[key] = []
    }

    const subs = this.subscriptions[key]
    if (subs.some(s => s.projectId === projectId && s.branchName === branchName)) {
      return
    }

    subs.push({ projectId, branchName })
  }

  getSubscriptions(teamId: string, userId: string) {
    return this.subscriptions[this.getKey(teamId, userId)] ?? []
  }

  reportBuild(projectId: string, branchName: string, success: boolean) {
    this.builds.push({ projectId, branchName, success })
  }

  getBuildInfo() {
    return this.builds
  }

  clearBuildInfo() {
    this.builds = []
  }

  private getKey(teamId: string, userId: string) {
    return `${teamId}_${userId}`
  }
}

export const app = new App()
