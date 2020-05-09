import { inject } from '../../utils/inject'
import { ConfigService } from '../ConfigService'
import { getBranches } from './getBranches'

interface Registry {
  [projectId: string]: {
    [repositoryName: string]: {
      branches: string[]
    }
  }
}

export class ProjectService {
  @inject
  private readonly configService!: ConfigService

  private registry: Registry = {}

  constructor() {}

  async initialize(): Promise<void> {
    const { repositories, host, accessToken } = this.configService.data.bitbucket
    return Promise.all(
      repositories.map(repo => getBranches(repo.projectId, repo.name, host, accessToken)),
    ).then(allResults => {
      for (let i = 0; i < allResults.length; i++) {
        const repo = repositories[i]
        const result = allResults[i]

        if (!this.registry[repo.projectId]) {
          this.registry[repo.projectId] = {}
        }

        this.registry[repo.projectId][repo.name] = {
          branches: result.map(bi => bi.displayId),
        }
      }
    })
  }

  /**
   * Returns list of branches with requested name
   * @param branchName {string}
   */
  findBranch(branchName: string) {
    const result = []
    for (const [projectId, project] of Object.entries(this.registry)) {
      for (const [repositoryName, repo] of Object.entries(project)) {
        if (repo.branches.includes(branchName)) {
          result.push({ projectId, repositoryName, branchName })
        }
      }
    }

    return result
  }
}
