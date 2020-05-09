import { inject } from '../../utils/inject'
import { ConfigService } from '../ConfigService'
import { isBranchExist } from './isBranchExist'

export class ProjectService {
  @inject
  private readonly configService!: ConfigService

  private requestMap: { [key: string]: Promise<boolean> } = {}

  private get projectIds(): string[] {
    return this.configService.data.bitbucket.repositories.map(repo => repo.name)
  }

  constructor() {}

  /**
   * Returns ids of the projects which contain requested branch
   * @param branchName {string}
   */
  getProjectIds(branchName: string) {
    return Promise.all(this.projectIds.map(projectId => this.isExist(projectId, branchName))).then(
      result => {
        const matchedProjectsIds = []
        for (let i = 0; i < result.length; i++) {
          if (result[i]) {
            matchedProjectsIds.push(this.projectIds[i])
          }
        }
        return matchedProjectsIds
      },
    )
  }

  private async isExist(projectId: string, branchName: string) {
    const key = getKey(projectId, branchName)
    if (this.requestMap[key]) {
      return this.requestMap[key]
    }

    this.requestMap[key] = isBranchExist(projectId, branchName).then(result => {
      delete this.requestMap[key]
      return result
    })

    return this.requestMap[key]
  }
}

function getKey(projectId: string, branchName: string) {
  return `${projectId}_${branchName}`
}
