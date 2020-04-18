class App {
  private subscriptions: { [key: string]: Array<{ projectId: string; branchName: string }> } = {}

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

  private getKey(teamId: string, userId: string) {
    return `${teamId}_${userId}`
  }
}

export const app = new App()
